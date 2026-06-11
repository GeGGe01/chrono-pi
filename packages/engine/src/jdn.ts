import type { JDN } from './types';

// Year may be any length and negative (astronomical numbering), so the deep-time witnesses parse.
const DAY_PATTERN = /^(-?\d+)-(\d{2})-(\d{2})$/;

// Gregorian ISO date → Julian Day Number (Fliegel–Van Flandern).
export function isoToJdn(iso: string): JDN {
  const match = DAY_PATTERN.exec(iso);
  if (!match) throw new Error(`Not an ISO date: ${iso}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

// Julian Day Number → Gregorian ISO date, the inverse of isoToJdn (Richards).
export function jdnToIso(jdn: JDN): string {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
}

// Every JDN from startIso to endIso, inclusive.
export function* eachJdn(startIso: string, endIso: string): Generator<JDN> {
  const end = isoToJdn(endIso);
  for (let jdn = isoToJdn(startIso); jdn <= end; jdn += 1) {
    yield jdn;
  }
}

function pad(value: number, width: number): string {
  const sign = value < 0 ? '-' : '';
  return sign + String(Math.abs(value)).padStart(width, '0');
}
