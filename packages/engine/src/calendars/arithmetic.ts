import { isoToJdn, jdnToIso } from '../jdn';
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

// Tabular Islamic, civil epoch (JDN 1948440 = 16 July 622 CE Julian), 30-year cycle with the civil leap
// set. Pure arithmetic — unlike Temporal (which maxes out near year 275760) it reaches the deep-future
// collision witness. Reproduces the same window rows the Temporal `islamic-civil` did.
const ISLAMIC_EPOCH = 1948440;

function islamicMonthStart(year: number, month: number): JDN {
  return (
    ISLAMIC_EPOCH -
    1 +
    354 * (year - 1) +
    Math.floor((3 + 11 * year) / 30) +
    29 * (month - 1) +
    Math.floor(month / 2) +
    1
  );
}

export const islamic: Calendar = {
  id: 'islamic',
  tier: 'canonical',
  independent: true,
  fields(jdn) {
    const year = Math.floor((30 * (jdn - ISLAMIC_EPOCH) + 10646) / 10631);
    let month = 1;
    while (month < 12 && islamicMonthStart(year, month + 1) <= jdn) month += 1;
    return { year, month, day: jdn - islamicMonthStart(year, month) + 1 };
  },
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

// Year-offset calendars that share another calendar's months and days: Assyrian and Armenian track the
// Gregorian date, Roman (AUC) tracks the Julian date. None is an independent collision gear.
export const assyrian: Calendar = {
  id: 'assyrian',
  tier: 'canonical',
  independent: false,
  fields(jdn) {
    const { year, month, day } = gregorianParts(jdn);
    return { year: year + 4750, month, day };
  },
};

export const armenian: Calendar = {
  id: 'armenian',
  tier: 'canonical',
  independent: false,
  fields(jdn) {
    const { year, month, day } = gregorianParts(jdn);
    return { year: year - 551, month, day };
  },
};

export const roman: Calendar = {
  id: 'roman',
  tier: 'canonical',
  independent: false,
  fields(jdn) {
    const { year, month, day } = julian.fields(jdn);
    return { year: year + 753, month, day };
  },
};

// Julian Period year: the Gregorian date with year + 4713 (Gregorian-aligned, not independent).
export const julianPeriod: Calendar = {
  id: 'julian-period',
  tier: 'canonical',
  independent: false,
  fields(jdn) {
    const { year, month, day } = gregorianParts(jdn);
    return { year: year + 4713, month, day };
  },
};

// Modified Julian Date: a plain day count (JD − 2400000.5). The mjd reckoning renders it; the standard
// π-instant's fractional day (.926…) extends it.
const MJD_EPOCH_JDN = 2400001; // 1858-11-17
export const mjd: Calendar = {
  id: 'mjd',
  tier: 'canonical',
  independent: true,
  fields(jdn) {
    return { year: jdn - MJD_EPOCH_JDN, month: 1, day: 1 };
  },
};

// Discordian: five 73-day seasons; year = Gregorian + 1166. Novelty — never a collision gear. St. Tib's
// Day (the leap day) is not modelled, since no reference date falls in a leap year.
export const discordian: Calendar = {
  id: 'discordian',
  tier: 'novelty',
  independent: false,
  fields(jdn) {
    const { year } = gregorianParts(jdn);
    const dayOfYear = jdn - isoToJdn(`${String(year).padStart(4, '0')}-01-01`) + 1;
    const season = Math.floor((dayOfYear - 1) / 73) + 1;
    const day = ((dayOfYear - 1) % 73) + 1;
    return { year: year + 1166, month: season, day };
  },
};

export const arithmeticCalendars: readonly Calendar[] = [
  holocene,
  unix,
  julian,
  coptic,
  ethiopic,
  islamic,
  buddhist,
  minguo,
  assyrian,
  armenian,
  roman,
  julianPeriod,
  mjd,
  discordian,
];

export function registerArithmeticCalendars(): void {
  for (const calendar of arithmeticCalendars) {
    registerCalendar(calendar);
  }
}
