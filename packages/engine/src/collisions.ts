import { getCalendar } from './calendars/registry';
import { scan } from './scan';
import type { JDN, PerfectDay } from './types';

export interface Collision {
  isoDate: string;
  jdn: JDN;
  perfectDays: PerfectDay[]; // every π reading on this day, including non-independent co-reads
  independentCalendars: string[]; // the distinct independent calendars — two or more makes it a collision
}

// Days on which two or more *independent* calendars read π — the double and triple pi-days. Co-reads
// from non-independent gears (Holocene with Gregorian, Minguo, the Buddhist Era, …) are kept in
// `perfectDays` for display but never counted toward the collision. Window search only; the deep-future
// Chinese-Remainder witness search is Phase 3.
export function findCollisions(startIso: string, endIso: string): Collision[] {
  const byDate = new Map<string, PerfectDay[]>();
  for (const day of scan(startIso, endIso)) {
    const readings = byDate.get(day.isoDate) ?? [];
    readings.push(day);
    byDate.set(day.isoDate, readings);
  }

  const collisions: Collision[] = [];
  for (const [isoDate, perfectDays] of byDate) {
    const independentCalendars = [
      ...new Set(
        perfectDays.filter((day) => getCalendar(day.calendarId)?.independent).map((day) => day.calendarId),
      ),
    ];
    if (independentCalendars.length >= 2) {
      collisions.push({ isoDate, jdn: perfectDays[0]!.jdn, perfectDays, independentCalendars });
    }
  }
  return collisions;
}
