import type { GcalEvent } from './events';

// Minimal Google Calendar v3 client over fetch — no SDK dependency. Auth is the
// installed-app OAuth flow: a long-lived refresh token (minted once, see README)
// is exchanged for a short-lived access token at the start of each run.

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/calendar/v3';

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  fetchImpl?: typeof fetch;
}

type Json = Record<string, unknown>;

export class GoogleCalendar {
  private accessToken: string | null = null;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: GoogleConfig) {
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  private async authorize(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    const res = await this.fetchImpl(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: this.config.refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    if (!res.ok) {
      throw new Error(`OAuth token exchange failed: ${res.status} ${await res.text()}`);
    }
    const body = (await res.json()) as { access_token?: string };
    if (!body.access_token) throw new Error('OAuth token exchange returned no access_token.');
    this.accessToken = body.access_token;
    return this.accessToken;
  }

  private async api(method: string, path: string, body?: Json): Promise<Json> {
    const token = await this.authorize();
    const res = await this.fetchImpl(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`Google API ${method} ${path} failed: ${res.status} ${await res.text()}`);
    }
    return (await res.json()) as Json;
  }

  // Find the dedicated calendar by summary, or create it. Returns its id.
  async ensureCalendar(summary: string): Promise<string> {
    const list = (await this.api('GET', '/users/me/calendarList?maxResults=250')) as {
      items?: { id: string; summary: string }[];
    };
    const existing = list.items?.find((c) => c.summary === summary);
    if (existing) return existing.id;
    const created = (await this.api('POST', '/calendars', { summary })) as { id: string };
    return created.id;
  }

  // Look an event up by its iCalUID (the idempotency key).
  async findByUid(calendarId: string, iCalUID: string): Promise<{ id: string } | undefined> {
    const path = `/calendars/${encodeURIComponent(calendarId)}/events?iCalUID=${encodeURIComponent(iCalUID)}&showDeleted=false&maxResults=2`;
    const res = (await this.api('GET', path)) as { items?: { id: string; status?: string }[] };
    return res.items?.find((e) => e.status !== 'cancelled');
  }

  // Idempotent upsert: existing UID → update in place; unknown UID → import
  // (import, unlike insert, accepts a caller-provided iCalUID).
  async upsert(calendarId: string, event: GcalEvent): Promise<'created' | 'updated'> {
    const existing = await this.findByUid(calendarId, event.iCalUID);
    const base = `/calendars/${encodeURIComponent(calendarId)}/events`;
    if (existing) {
      await this.api('PUT', `${base}/${encodeURIComponent(existing.id)}`, {
        ...event,
      } as unknown as Json);
      return 'updated';
    }
    await this.api('POST', `${base}/import`, { ...event } as unknown as Json);
    return 'created';
  }
}
