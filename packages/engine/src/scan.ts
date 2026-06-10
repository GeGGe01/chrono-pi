import { registerArithmeticCalendars } from './calendars/arithmetic';
import { getCalendar } from './calendars/registry';
import { registerTemporalCalendars } from './calendars/temporal';
import { clockDigits } from './clock';
import { eachJdn, jdnToIso } from './jdn';
import { matchDepth } from './pi';
import { listReckonings } from './reckonings/registry';
import { registerStandardReckonings } from './reckonings/standard';
import type { PerfectDay } from './types';

// Register the seed calendars and reckonings into the global registries. Idempotent (keyed by id),
// so callers can scan without wiring the world up first.
export function seedDefaults(): void {
  registerTemporalCalendars();
  registerArithmeticCalendars();
  registerStandardReckonings();
}

// Scan an inclusive ISO date range and emit a PerfectDay for every (calendar, reckoning) whose read
// — extended by the π-instant where the reckoning allows — reaches the reckoning's qualifying depth.
export function scan(startIso: string, endIso: string): PerfectDay[] {
  seedDefaults();
  const reckonings = listReckonings();
  const days: PerfectDay[] = [];

  for (const jdn of eachJdn(startIso, endIso)) {
    for (const reckoning of reckonings) {
      const calendar = getCalendar(reckoning.calendarId);
      if (!calendar) continue;

      const read = reckoning.read(calendar.fields(jdn), jdn);
      const digits = read.digits + clockDigits(reckoning);
      const depth = matchDepth(digits);
      if (depth < reckoning.minDepth) continue;

      days.push({
        jdn,
        isoDate: jdnToIso(jdn),
        calendarId: calendar.id,
        reckoningId: reckoning.id,
        digits,
        depth,
        tier: reckoning.tier,
      });
    }
  }

  return days;
}
