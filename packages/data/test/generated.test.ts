import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { collisionsArtifactSchema, perfectDaysArtifactSchema } from '../src/schemas';

function readJson(name: string): unknown {
  return JSON.parse(readFileSync(new URL(`../generated/${name}`, import.meta.url), 'utf8'));
}

// Parsing at module scope is itself the schema gate: malformed or non-conforming committed JSON
// throws here and fails the whole file.
const perfectDays = perfectDaysArtifactSchema.parse(readJson('perfect-days.json'));
const collisions = collisionsArtifactSchema.parse(readJson('collisions.json'));

describe('committed perfect-days.json', () => {
  it('covers the 2000–2226 window with a count matching its rows', () => {
    expect(perfectDays.window).toEqual({ start: '2000-01-01', end: '2226-12-31' });
    expect(perfectDays.count).toBe(perfectDays.days.length);
  });

  it('includes the Gregorian Pi Day anchor 2015-03-14', () => {
    const anchor = perfectDays.days.find(
      (day) => day.isoDate === '2015-03-14' && day.calendarId === 'gregorian',
    );
    expect(anchor).toBeDefined();
    expect(anchor?.digits.startsWith('31415')).toBe(true);
  });

  it('is sorted by ascending JDN', () => {
    const jdns = perfectDays.days.map((day) => day.jdn);
    expect(jdns).toEqual([...jdns].sort((a, b) => a - b));
  });
});

describe('committed collisions.json', () => {
  it('covers the same window with no in-window collisions', () => {
    expect(collisions.window).toEqual({ start: '2000-01-01', end: '2226-12-31' });
    expect(collisions.windowCollisions).toEqual([]);
  });

  it('pins the historical and deep-future witnesses', () => {
    const byKind = Object.fromEntries(collisions.witnesses.map((witness) => [witness.kind, witness]));
    expect(byKind.historical?.isoDate).toBe('0215-03-14');
    expect([...(byKind.historical?.independentCalendars ?? [])].sort()).toEqual([
      'gregorian',
      'julian',
    ]);
    expect(byKind['deep-future']?.isoDate).toBe('2197415-03-14');
    expect([...(byKind['deep-future']?.independentCalendars ?? [])].sort()).toEqual([
      'gregorian',
      'islamic',
    ]);
  });
});
