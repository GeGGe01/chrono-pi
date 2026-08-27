// reckon() — the deterministic merge-driven search game (docs/RECKONING.md). Pure and fully testable
// off-CI: a merge descriptor in, a bounded search result out. No git, no I/O, no clock — every input is
// passed in, so the same merge always reckons the same catches.

import { jdnToIso } from '../jdn';
import { compileGear, readDepth, witnessJdns, type Gear } from '../residue';

import { fortunes, type Fortune, type MergeFacts } from './fortunes';

// Season-0 constants — locked by the anchor-signed operator order (RECKONING.md §9).
export const SEASON0 = {
  SAFE_MIN: 0,
  SAFE_MAX: 1_000_000_000, // ≈ year 2.7 M; brackets both verified doubles, stays exact (< 2^53)
  GENESIS: 1_721_426, // JDN of 1 CE — the BC/AD boundary for the era label
  PITCH: 36_524, // ≈ one Gregorian π-day's mean spacing; one helix turn ≈ one expected single date
  MAX_TURNS: 124, // 31×4 — the clock cap (anti-slack)
  DIRECTION_RATIO: 0.1, // D ≥ 0.1·A ⇒ BC; else AD
  QUALIFYING_DEPTH: 5, // minimum π-depth for a catch (31415)
} as const;

// Season-0 whitelist: deep-time-safe arithmetic calendars × the periodic date-orderings. (yyyy-mm-dd is
// non-periodic — a finite π-year set — so it is a later append, not a season-0 residue gear.)
const GEAR_SPEC: ReadonlyArray<{ calendarId: string; reckoningId: string; period: number; base: string }> = [
  { calendarId: 'gregorian', reckoningId: 'gregorian/mm-dd-yy', period: 146097, base: '1600-01-01' },
  { calendarId: 'gregorian', reckoningId: 'gregorian/yy-m-dd', period: 146097, base: '1600-01-01' },
  { calendarId: 'julian', reckoningId: 'julian/mm-dd-yy', period: 36525, base: '2000-01-01' },
  { calendarId: 'julian', reckoningId: 'julian/yy-m-dd', period: 36525, base: '2000-01-01' },
  { calendarId: 'islamic', reckoningId: 'islamic/mm-dd-yy', period: 106310, base: '2000-01-01' },
  { calendarId: 'islamic', reckoningId: 'islamic/yy-m-dd', period: 106310, base: '2000-01-01' },
];

let compiled: Gear[] | null = null;
function seasonGears(): Gear[] {
  if (!compiled) compiled = GEAR_SPEC.map((g) => compileGear(g.calendarId, g.reckoningId, g.period, g.base));
  return compiled;
}

export type Direction = 'AD' | 'BC';

export interface Reading {
  calendarId: string;
  reckoningId: string;
  depth: number;
}

export interface Catch {
  jdn: number;
  isoDate: string;
  era: Direction; // relative to GENESIS
  multiplicity: number; // distinct independent calendars reading π on this day
  readings: Reading[]; // every whitelisted (calendar, reckoning) that reads π here (the full profile)
}

export interface ReckonInput extends MergeFacts {
  additions: number; // A
  deletions: number; // D
}

export interface ReckonResult {
  f: number; // base clock (commits, clamped)
  fPrime: number; // effective clock after fortunes
  direction: Direction; // era the helix spirals toward, from A vs D
  fortunes: Fortune[]; // the factors that fired
  legendary: boolean;
  window: { start: number; stop: number };
  voided: boolean; // f' == 0 (a search ran, caught nothing) or A == 0
  catches: Catch[]; // catches[0] is the claim (earliest in the search direction); [] if void/none
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(x, hi));
}

// The full π-profile of a day across the whitelist — read every whitelisted gear so nobody can
// cherry-pick which calendars count (RECKONING.md §6). multiplicity counts distinct calendars.
function profile(jdn: number, gears: Gear[]): Reading[] {
  const readings: Reading[] = [];
  for (const g of gears) {
    const depth = readDepth(jdn, g.calendarId, g.reckoningId);
    if (depth >= SEASON0.QUALIFYING_DEPTH) {
      readings.push({ calendarId: g.calendarId, reckoningId: g.reckoningId, depth });
    }
  }
  return readings;
}

export function reckon(input: ReckonInput): ReckonResult {
  const { SAFE_MIN, SAFE_MAX, GENESIS, PITCH, MAX_TURNS, DIRECTION_RATIO } = SEASON0;

  // Direction: additions vs deletions. A == 0 ⇒ void (no coherent direction).
  const { additions: A, deletions: D } = input;
  const directionDefined = A > 0;
  const isBC = directionDefined && D >= DIRECTION_RATIO * A; // 10·D ≥ A at ratio 0.1
  const direction: Direction = isBC ? 'BC' : 'AD';
  const dir = isBC ? -1 : 1;

  // Clock and fortunes.
  const f = clamp(input.commits, 1, MAX_TURNS);
  const fr = fortunes(input);
  let fPrime = fr.legendary ? MAX_TURNS : clamp(Math.round(f * fr.product), 0, MAX_TURNS);
  if (!directionDefined) fPrime = 0;
  const voided = fPrime === 0;

  // Seed → window. The first 12 hex of the sha place the search deterministically in the safe band.
  const seed = Number(BigInt(`0x${input.sha.slice(0, 12)}`) % BigInt(SAFE_MAX - SAFE_MIN));
  const anchor = SAFE_MIN + seed;
  const reach = fPrime * PITCH;
  const start = clamp(dir > 0 ? anchor : anchor - reach, SAFE_MIN, SAFE_MAX);
  const stop = clamp(dir > 0 ? anchor + reach : anchor, SAFE_MIN, SAFE_MAX);

  const result: ReckonResult = {
    f,
    fPrime,
    direction,
    fortunes: fr.applied,
    legendary: fr.legendary,
    window: { start, stop },
    voided,
    catches: [],
  };
  if (voided || stop <= start) return result;

  // Search: every whitelisted gear enumerates its π-days in the window (arithmetic, no scan); confirm
  // each independently; collect distinct days.
  const gears = seasonGears();
  const hitJdns = new Set<number>();
  for (const g of gears) {
    for (const jdn of witnessJdns(g, start, stop)) {
      if (readDepth(jdn, g.calendarId, g.reckoningId) >= SEASON0.QUALIFYING_DEPTH) hitJdns.add(jdn);
    }
  }

  // Order by the search direction so catches[0] is the day the helix reaches first.
  const ordered = [...hitJdns].sort((a, b) => (dir > 0 ? a - b : b - a));
  for (const jdn of ordered) {
    const readings = profile(jdn, gears);
    const calendars = new Set(readings.map((r) => r.calendarId));
    result.catches.push({
      jdn,
      isoDate: jdnToIso(jdn),
      era: jdn < GENESIS ? 'BC' : 'AD',
      multiplicity: calendars.size,
      readings,
    });
  }
  return result;
}
