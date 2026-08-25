import { describe, expect, it } from 'vitest';

import { isoToJdn } from '../src/jdn';
import { compileGear, verifyWitness, witnessJdns } from '../src/residue';
import { scan } from '../src/scan';

// The Gregorian mm-dd-yy π-reading repeats modulo the 400-year leap cycle = 146097 days, because the
// rendered fields (month, day, year mod 100) are all periodic mod it. This is the article's effective
// Gregorian π-period.
const GREGORIAN_PI_PERIOD = 146097;
const CAL = 'gregorian';
const RECK = 'gregorian/mm-dd-yy';

// One-period compile lives in the Temporal reader's supported era.
const gear = compileGear(CAL, RECK, GREGORIAN_PI_PERIOD, '1600-01-01');

describe('deterministic residue gear — gregorian/mm-dd-yy', () => {
  it('compiles a canonical active residue set over one supercycle', () => {
    expect(gear.period).toBe(GREGORIAN_PI_PERIOD);
    // The article: four π-residues — the four years ending in 15 (one March 14 each) per 400-year cycle.
    expect(gear.residues.length).toBe(4);
    expect(gear.residues).toEqual([...gear.residues].sort((a, b) => a - b)); // sorted, canonical
    for (const r of gear.residues) {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(GREGORIAN_PI_PERIOD);
    }
  });

  it('arithmetic witnesses equal the brute-force v1 scan on a shared range', () => {
    // The oracle (scan) is O(days × reckonings); keep its range small. The engine covers the same range
    // arithmetically and — see the next test — ranges the scan could never afford.
    const startIso = '2000-01-01';
    const endIso = '2020-12-31';
    const fromGear = witnessJdns(gear, isoToJdn(startIso), isoToJdn(endIso));
    const fromScan = scan(startIso, endIso)
      .filter((d) => d.calendarId === CAL && d.reckoningId === RECK)
      .map((d) => d.jdn)
      .sort((a, b) => a - b);
    expect(fromGear).toEqual(fromScan);
    expect(fromGear).toEqual([isoToJdn('2015-03-14')]); // the only year ending in 15 in the window
  });

  it('enumerates a far-future supercycle arithmetically — the no-scan win', () => {
    // 4 residues per 146097-day cycle → exactly 4 witnesses in any single supercycle, anywhere on the
    // axis, produced with no calendar reads at all (a range the brute-force scan cannot afford).
    const start = 5_000_000; // ~year 8977 CE, one arbitrary far cycle
    const w = witnessJdns(gear, start, start + GREGORIAN_PI_PERIOD - 1);
    expect(w.length).toBe(4);
    expect(w).toEqual([...w].sort((a, b) => a - b));
  });

  it('independent verifier accepts every emitted witness and rejects a non-π day', () => {
    const witnesses = witnessJdns(gear, isoToJdn('2000-01-01'), isoToJdn('2020-12-31'));
    for (const t of witnesses) {
      expect(verifyWitness(t, CAL, RECK)).toBe(true);
    }
    expect(verifyWitness(isoToJdn('2000-01-01'), CAL, RECK)).toBe(false);
  });
});
