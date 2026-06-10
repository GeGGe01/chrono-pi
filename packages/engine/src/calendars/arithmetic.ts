import { jdnToIso } from '../jdn';
import type { Calendar, JDN } from '../types';
import { registerCalendar } from './registry';

const UNIX_EPOCH_JDN = 2440588; // 1970-01-01
const SECONDS_PER_DAY = 86400;

function gregorianParts(jdn: JDN): { year: number; month: number; day: number } {
  const [year, month, day] = jdnToIso(jdn).split('-').map(Number);
  return { year, month, day };
}

// Holocene (Human Era): the Gregorian calendar with its year shifted by 10000. Not an independent
// collision gear — it is the Gregorian gear relabelled, so it never contributes to a collision claim.
export const holocene: Calendar = {
  id: 'holocene',
  tier: 'canonical',
  independent: false,
  fields(jdn) {
    const { year, month, day } = gregorianParts(jdn);
    return { year: year + 10000, month, day };
  },
};

// Unix time has no months or days; `year` carries the second count at midnight UTC,
// which the unix reckoning renders (the π-instant extends it with fractional seconds).
export const unix: Calendar = {
  id: 'unix',
  tier: 'canonical',
  independent: true,
  fields(jdn) {
    return { year: (jdn - UNIX_EPOCH_JDN) * SECONDS_PER_DAY, month: 1, day: 1 };
  },
};

// Julian calendar via the Richards algorithm. Temporal/ICU has no Julian calendar, so it is
// computed arithmetically over the JDN — same linear axis as every other calendar.
export const julian: Calendar = {
  id: 'julian',
  tier: 'canonical',
  independent: true,
  fields(jdn) {
    const e = 4 * (jdn + 1401) + 3;
    const g = Math.floor((e % 1461) / 4);
    const h = 5 * g + 2;
    const day = Math.floor((h % 153) / 5) + 1;
    const month = ((Math.floor(h / 153) + 2) % 12) + 1;
    const year = Math.floor(e / 1461) - 4716 + Math.floor((14 - month) / 12);
    return { year, month, day };
  },
};

export const arithmeticCalendars: readonly Calendar[] = [holocene, unix, julian];

export function registerArithmeticCalendars(): void {
  for (const calendar of arithmeticCalendars) {
    registerCalendar(calendar);
  }
}
