import { getPerfectDays } from 'chrono-pi-data';

import { buildEvent } from './events';
import { GoogleCalendar } from './google';

// Phase 6 (02-long-horizon): populate a dedicated "Perfect Pi-Days" calendar over the
// lifetime window. Idempotent — every event carries a stable iCalUID, so re-running
// updates in place instead of duplicating. OAuth setup is documented in the README.

export const CALENDAR_SUMMARY = 'Perfect Pi-Days';

export interface SyncOptions {
  timeZone: string;
  dryRun: boolean;
  tier?: 'canonical' | 'novelty';
}

export interface SyncResult {
  created: number;
  updated: number;
  skipped: number;
  total: number;
}

export async function sync(client: GoogleCalendar, options: SyncOptions): Promise<SyncResult> {
  const artifact = getPerfectDays();
  const days = options.tier
    ? artifact.days.filter((d) => d.tier === options.tier)
    : artifact.days;

  const result: SyncResult = { created: 0, updated: 0, skipped: 0, total: days.length };
  if (options.dryRun) {
    for (const day of days) {
      const event = buildEvent(day, options.timeZone);
      console.log(`[dry-run] ${event.start.dateTime} ${event.summary} (${event.iCalUID})`);
    }
    result.skipped = days.length;
    return result;
  }

  const calendarId = await client.ensureCalendar(CALENDAR_SUMMARY);
  for (const day of days) {
    const event = buildEvent(day, options.timeZone);
    const outcome = await client.upsert(calendarId, event);
    result[outcome] += 1;
    console.log(`[sync] ${outcome}: ${event.start.dateTime} ${event.summary}`);
  }
  return result;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name} — see apps/sync/README.md for OAuth setup.`);
  return value;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const timeZone = process.env.SYNC_TIMEZONE ?? 'Europe/Stockholm';

  const client = dryRun
    ? // Dry-run never talks to Google; the client is constructed but unused.
      new GoogleCalendar({ clientId: '', clientSecret: '', refreshToken: '' })
    : new GoogleCalendar({
        clientId: requireEnv('GOOGLE_CLIENT_ID'),
        clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
        refreshToken: requireEnv('GOOGLE_REFRESH_TOKEN'),
      });

  const result = await sync(client, { timeZone, dryRun });
  console.log(
    `[sync] done: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped of ${result.total}.`,
  );
}

// Only run as a CLI, not when imported by tests.
if (process.argv[1]?.endsWith('index.ts') || process.argv[1]?.endsWith('index.js')) {
  main().catch((err) => {
    console.error('[sync] failed:', err);
    process.exitCode = 1;
  });
}
