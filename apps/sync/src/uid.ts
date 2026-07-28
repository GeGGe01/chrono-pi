import type { PerfectDay } from 'chrono-pi-data';

// The idempotency anchor (01-whitepaper §design decisions): a stable iCalUID derived from
// (date, calendar, reckoning) makes the sync safe to re-run without duplicates. The UID must
// never change for an existing perfect day — Google treats it as the event's identity.
export function iCalUid(day: Pick<PerfectDay, 'isoDate' | 'calendarId' | 'reckoningId'>): string {
  // reckoningId contains '/', which is not iCalUID-safe; flatten to '-'.
  const reckoning = day.reckoningId.replaceAll('/', '-');
  return `${day.isoDate}_${day.calendarId}_${reckoning}@chrono-pi`;
}
