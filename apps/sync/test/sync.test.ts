import { describe, expect, it } from 'vitest';

import { buildEvent, PI_INSTANT_TIME } from '../src/events';
import { GoogleCalendar } from '../src/google';
import { CALENDAR_SUMMARY, sync } from '../src/index';
import { iCalUid } from '../src/uid';

const day = {
  jdn: 2457016,
  isoDate: '2014-12-24',
  calendarId: 'coptic',
  reckoningId: 'coptic/yy-m-dd',
  digits: '3141592653589',
  depth: 13,
  tier: 'canonical',
} as const;

describe('iCalUid', () => {
  it('derives a stable, slash-free UID from (date, calendar, reckoning)', () => {
    expect(iCalUid(day)).toBe('2014-12-24_coptic_coptic-yy-m-dd@chrono-pi');
    expect(iCalUid(day)).toBe(iCalUid({ ...day }));
  });
});

describe('buildEvent', () => {
  it('places the event at the π-instant with the reading in the title', () => {
    const event = buildEvent(day, 'Europe/Stockholm');
    expect(event.start).toEqual({
      dateTime: `2014-12-24T${PI_INSTANT_TIME}`,
      timeZone: 'Europe/Stockholm',
    });
    expect(event.summary).toContain('3.141592653589');
    expect(event.summary).toContain('coptic');
    expect(event.iCalUID).toBe(iCalUid(day));
  });
});

// In-memory Google Calendar: enough of the v3 surface for ensureCalendar +
// findByUid + import/update, so idempotency is provable without credentials.
function fakeGoogle() {
  const calendars: { id: string; summary: string }[] = [];
  const events = new Map<string, { id: string; iCalUID: string; body: unknown }>();
  let nextId = 1;
  const calls: string[] = [];

  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    calls.push(`${method} ${url.replace('https://www.googleapis.com/calendar/v3', '')}`);
    const json = (body: unknown, status = 200) =>
      new Response(JSON.stringify(body), { status });

    if (url.includes('oauth2.googleapis.com/token')) {
      return json({ access_token: 'test-token' });
    }
    if (url.includes('/users/me/calendarList')) {
      return json({ items: calendars });
    }
    if (url.endsWith('/calendars') && method === 'POST') {
      const body = JSON.parse(String(init?.body)) as { summary: string };
      const cal = { id: `cal-${nextId++}`, summary: body.summary };
      calendars.push(cal);
      return json(cal);
    }
    const eventsMatch = url.match(/\/calendars\/([^/]+)\/events/);
    if (eventsMatch) {
      if (method === 'GET') {
        const uid = new URL(url).searchParams.get('iCalUID');
        const found = [...events.values()].filter((e) => e.iCalUID === uid);
        return json({ items: found.map((e) => ({ id: e.id, status: 'confirmed' })) });
      }
      if (method === 'POST' && url.includes('/events/import')) {
        const body = JSON.parse(String(init?.body)) as { iCalUID: string };
        const id = `ev-${nextId++}`;
        events.set(id, { id, iCalUID: body.iCalUID, body });
        return json({ id });
      }
      if (method === 'PUT') {
        const id = decodeURIComponent(url.split('/events/')[1]!.split('?')[0]!);
        const existing = events.get(id);
        if (!existing) return json({ error: 'not found' }, 404);
        events.set(id, { ...existing, body: JSON.parse(String(init?.body)) });
        return json({ id });
      }
    }
    return json({ error: `unhandled ${method} ${url}` }, 500);
  };

  return { fetchImpl, calendars, events, calls };
}

function client(fetchImpl: typeof fetch): GoogleCalendar {
  return new GoogleCalendar({
    clientId: 'id',
    clientSecret: 'secret',
    refreshToken: 'refresh',
    fetchImpl,
  });
}

describe('sync', () => {
  it('creates the dedicated calendar and one event per perfect day', async () => {
    const g = fakeGoogle();
    const result = await sync(client(g.fetchImpl), {
      timeZone: 'Europe/Stockholm',
      dryRun: false,
    });
    expect(g.calendars).toEqual([{ id: 'cal-1', summary: CALENDAR_SUMMARY }]);
    expect(result.created).toBe(result.total);
    expect(result.updated).toBe(0);
    expect(g.events.size).toBe(result.total);
  });

  it('is idempotent: a second run updates in place and adds no duplicates', async () => {
    const g = fakeGoogle();
    const first = await sync(client(g.fetchImpl), {
      timeZone: 'Europe/Stockholm',
      dryRun: false,
    });
    const second = await sync(client(g.fetchImpl), {
      timeZone: 'Europe/Stockholm',
      dryRun: false,
    });
    expect(second.created).toBe(0);
    expect(second.updated).toBe(first.created);
    expect(g.events.size).toBe(first.total);
    expect(g.calendars).toHaveLength(1);
  });

  it('dry-run touches nothing', async () => {
    const g = fakeGoogle();
    const result = await sync(client(g.fetchImpl), {
      timeZone: 'Europe/Stockholm',
      dryRun: true,
    });
    expect(result.skipped).toBe(result.total);
    expect(g.calls).toHaveLength(0);
    expect(g.events.size).toBe(0);
  });
});
