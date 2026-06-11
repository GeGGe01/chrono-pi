import { Temporal } from '@js-temporal/polyfill';

import { isoToJdn, jdnToIso } from '../jdn';
import type { Calendar, CalendarFields, JDN, Tier } from '../types';
import { registerCalendar } from './registry';

// A calendar read through Temporal: map the JDN to its ISO day, then reinterpret it under `calendarId`.
// `calendarId` is the explicit ICU identifier (e.g. 'islamic-tbla'); `id` is this project's calendar id.
function temporalCalendar(
  id: string,
  calendarId: string,
  options: { tier: Tier; independent: boolean },
): Calendar {
  return {
    id,
    tier: options.tier,
    independent: options.independent,
    fields(jdn: JDN): CalendarFields {
      const date = Temporal.PlainDate.from(jdnToIso(jdn)).withCalendar(calendarId);
      return {
        year: date.year,
        month: date.month,
        day: date.day,
        eraYear: date.eraYear,
      };
    },
  };
}

const canonical = { tier: 'canonical', independent: true } as const;

// Gregorian via the JDN formula (not Temporal) so it reaches deep time for the collision witnesses.
const ISO_DAY = /^(-?\d+)-(\d{2})-(\d{2})$/;
export const gregorian: Calendar = {
  id: 'gregorian',
  tier: 'canonical',
  independent: true,
  fields(jdn: JDN): CalendarFields {
    const [, year, month, day] = ISO_DAY.exec(jdnToIso(jdn)) ?? [];
    return { year: Number(year), month: Number(month), day: Number(day) };
  },
};

export const hebrew = temporalCalendar('hebrew', 'hebrew', canonical);
export const persian = temporalCalendar('persian', 'persian', canonical);
export const indian = temporalCalendar('indian', 'indian', canonical);

// The Japanese era calendar is meaningful only from Meiji (1868); earlier, Temporal returns a proleptic
// era that would over-read collisions, so it is bounded.
const MEIJI_START_JDN = isoToJdn('1868-01-01');
export const japanese: Calendar = {
  id: 'japanese',
  tier: 'canonical',
  independent: true,
  fields(jdn: JDN): CalendarFields {
    if (jdn < MEIJI_START_JDN) {
      throw new RangeError('japanese era calendar is undefined before Meiji (1868)');
    }
    const date = Temporal.PlainDate.from(jdnToIso(jdn)).withCalendar('japanese');
    return { year: date.year, month: date.month, day: date.day, eraYear: date.eraYear };
  },
};

export const temporalCalendars: readonly Calendar[] = [gregorian, hebrew, persian, indian, japanese];

export function registerTemporalCalendars(): void {
  for (const calendar of temporalCalendars) {
    registerCalendar(calendar);
  }
}
