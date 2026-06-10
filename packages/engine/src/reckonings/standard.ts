import type { CalendarFields, Reckoning, Tier } from '../types';
import { registerReckoning } from './registry';

// A reckoning renders its fields as their natural decimal digits, in a declared order, with no
// separators and no leading zeros — exactly what turns 3/14/15 into 31415.
type DateFormat = 'mm-dd-yy' | 'yy-m-dd' | 'yyyy-mm-dd';
type FieldOrder = (fields: CalendarFields) => number[];

const ORDERS: Record<DateFormat, FieldOrder> = {
  'mm-dd-yy': (f) => [f.month, f.day, f.year % 100], // American middle-endian: 3/14/15 → 31415
  'yy-m-dd': (f) => [f.year % 100, f.month, f.day], // inverted little-endian: 31/4/15 → 31415
  'yyyy-mm-dd': (f) => [f.year, f.month, f.day], // ISO big-endian: 3141/5/9 → 314159
};

function digits(values: number[]): string {
  return values.map((value) => String(value)).join('');
}

// A date reckoning reads one calendar's fields via a named field-order format. The same format applies
// to many calendars, so the id is compound (`<calendarId>/<format>`) while `format` stays shared.
export function dateReckoning(calendarId: string, format: DateFormat, tier: Tier = 'canonical'): Reckoning {
  const order = ORDERS[format];
  return {
    id: `${calendarId}/${format}`,
    calendarId,
    format,
    tier,
    minDepth: 5,
    timeExtends: true,
    read(fields: CalendarFields) {
      const rendered = digits(order(fields));
      return { digits: rendered, label: `${calendarId} · ${format} → ${rendered}` };
    },
  };
}

// Unix time: the second count rendered as digits; the π-instant extends it with fractional seconds.
// Its floor is deeper because a five-digit prefix of a ten-digit timestamp is not a meaningful read.
export const unixTimestamp: Reckoning = {
  id: 'unix/timestamp',
  calendarId: 'unix',
  format: 'timestamp',
  tier: 'canonical',
  minDepth: 10,
  timeExtends: true,
  read(fields: CalendarFields) {
    return { digits: String(fields.year), label: `unix · timestamp → ${fields.year}` };
  },
};

// Gregorian instances — the Phase 1 public surface.
export const mmddyy = dateReckoning('gregorian', 'mm-dd-yy');
export const yymdd = dateReckoning('gregorian', 'yy-m-dd');
export const yyyymmdd = dateReckoning('gregorian', 'yyyy-mm-dd');

// Calendars whose Gregorian/Julian-style date the table reads via mm-dd-yy and yy-m-dd. ISO yyyy-mm-dd
// is Gregorian-only (the only four-digit-year reading in range). The set grows as batches land.
const DATE_CALENDARS = ['gregorian', 'julian', 'holocene'] as const;

export const standardReckonings: readonly Reckoning[] = [
  ...DATE_CALENDARS.flatMap((calendar) => [
    dateReckoning(calendar, 'mm-dd-yy'),
    dateReckoning(calendar, 'yy-m-dd'),
  ]),
  yyyymmdd,
  unixTimestamp,
];

export function registerStandardReckonings(): void {
  for (const reckoning of standardReckonings) {
    registerReckoning(reckoning);
  }
}
