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

// Coptic and Ethiopic: twelve 30-day months plus a short epagomenal "month", leap every fourth year.
// The Temporal polyfill mishandles their eras, so they are computed directly over the JDN.
const COPTIC_EPOCH = 1825030; // JDN of 1 Thout 1 (29 Aug 284 CE Julian)
const ETHIOPIC_EPOCH = 1724221; // JDN of 1 Mäskäräm 1 (29 Aug 8 CE Julian)

function epagomenalStart(epoch: number, year: number, month: number): number {
  return epoch - 1 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + 1;
}

function epagomenalFields(jdn: JDN, epoch: number) {
  const year = Math.floor((4 * (jdn - epoch) + 1463) / 1461);
  const month = Math.floor((jdn - epagomenalStart(epoch, year, 1)) / 30) + 1;
  const day = jdn - epagomenalStart(epoch, year, month) + 1;
  return { year, month, day };
}

export const coptic: Calendar = {
  id: 'coptic',
  tier: 'canonical',
  independent: true,
  fields: (jdn) => epagomenalFields(jdn, COPTIC_EPOCH),
};

export const ethiopic: Calendar = {
  id: 'ethiopic',
  tier: 'canonical',
  independent: true,
  fields: (jdn) => epagomenalFields(jdn, ETHIOPIC_EPOCH),
};

// Thai Buddhist Era and the ROC/Juche year: Gregorian months and days with a shifted year, like
// Holocene — not independent collision gears.
export const buddhist: Calendar = {
  id: 'buddhist',
  tier: 'canonical',
  independent: false,
  fields(jdn) {
    const { year, month, day } = gregorianParts(jdn);
    return { year: year + 543, month, day };
  },
};

export const minguo: Calendar = {
  id: 'minguo',
  tier: 'canonical',
  independent: false,
  fields(jdn) {
    const { year, month, day } = gregorianParts(jdn);
    return { year: year - 1911, month, day };
  },
};

export const arithmeticCalendars: readonly Calendar[] = [
  holocene,
  unix,
  julian,
  coptic,
  ethiopic,
  buddhist,
  minguo,
];

export function registerArithmeticCalendars(): void {
  for (const calendar of arithmeticCalendars) {
    registerCalendar(calendar);
  }
}
