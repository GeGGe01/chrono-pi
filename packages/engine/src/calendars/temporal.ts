import { Temporal } from '@js-temporal/polyfill';

import { jdnToIso } from '../jdn';
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

export const gregorian = temporalCalendar('gregorian', 'gregory', canonical);
export const hebrew = temporalCalendar('hebrew', 'hebrew', canonical);
export const persian = temporalCalendar('persian', 'persian', canonical);
// The reference table's "Islamisk" matches the tabular *civil* epoch, not the astronomical (tbla) one
// the whitepaper assumed — the oracle corrects the assumption. (They differ by one day.)
export const islamic = temporalCalendar('islamic', 'islamic-civil', canonical);

export const temporalCalendars: readonly Calendar[] = [gregorian, hebrew, persian, islamic];

export function registerTemporalCalendars(): void {
  for (const calendar of temporalCalendars) {
    registerCalendar(calendar);
  }
}
