import type { CalendarFields, Reckoning } from '../types';
import { registerReckoning } from './registry';

// A reckoning renders its fields as their natural decimal digits, in a declared order, with no
// separators and no leading zeros — exactly what turns 3/14/15 into 31415.
function digits(...fields: number[]): string {
  return fields.map((field) => String(field)).join('');
}

const canonical = { tier: 'canonical', timeExtends: true } as const;

// American middle-endian, two-digit year: 3/14/15 → 31415.
export const mmddyy: Reckoning = {
  id: 'mm-dd-yy',
  calendarId: 'gregorian',
  minDepth: 5,
  ...canonical,
  read(fields: CalendarFields) {
    const yy = fields.year % 100;
    return { digits: digits(fields.month, fields.day, yy), label: `gregorian · MM-DD-YY → ${fields.month}:${fields.day}:${yy}` };
  },
};

// ISO big-endian, four-digit year: 3141/5/9 → 314159.
export const yyyymmdd: Reckoning = {
  id: 'yyyy-mm-dd',
  calendarId: 'gregorian',
  minDepth: 5,
  ...canonical,
  read(fields: CalendarFields) {
    return { digits: digits(fields.year, fields.month, fields.day), label: `gregorian · YYYY-MM-DD → ${fields.year}:${fields.month}:${fields.day}` };
  },
};

// Inverted little-endian with two-digit year first: 31/4/15 → 31415.
export const yymdd: Reckoning = {
  id: 'yy-m-dd',
  calendarId: 'gregorian',
  minDepth: 5,
  ...canonical,
  read(fields: CalendarFields) {
    const yy = fields.year % 100;
    return { digits: digits(yy, fields.month, fields.day), label: `gregorian · YY-M-DD → ${yy}:${fields.month}:${fields.day}` };
  },
};

// Unix time: the second count rendered as digits (the π-instant extends it with fractional seconds).
// Its floor is deeper because a five-digit prefix of a ten-digit timestamp is not a meaningful read.
export const unixTimestamp: Reckoning = {
  id: 'unix-timestamp',
  calendarId: 'unix',
  minDepth: 10,
  ...canonical,
  read(fields: CalendarFields) {
    return { digits: String(fields.year), label: `unix · seconds → ${fields.year}` };
  },
};

export const standardReckonings: readonly Reckoning[] = [mmddyy, yyyymmdd, yymdd, unixTimestamp];

export function registerStandardReckonings(): void {
  for (const reckoning of standardReckonings) {
    registerReckoning(reckoning);
  }
}
