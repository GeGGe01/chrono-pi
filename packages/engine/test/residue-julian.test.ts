import { describe, expect, it } from 'vitest';

import { isoToJdn } from '../src/jdn';
import { compileGear, verifyWitness, witnessJdns } from '../src/residue';
import { scan } from '../src/scan';

// The Julian mm-dd-yy reading repeats modulo 100 Julian years = 36525 days: the 4-year leap cycle
// (1461 days) divides it 25 times, and year mod 100 shares the same 100-year span. Unlike Gregorian
// (400-year cycle, 146097 days) there is no century exception, so the period is a quarter as long —
// and holds exactly one year ending in 15, hence one π-residue. The Julian reader is arithmetic
// (Richards over JDN), so this compile is deep-time-safe and fast — no Temporal.
const JULIAN_PI_PERIOD = 36525;
const CAL = 'julian';
const RECK = 'julian/mm-dd-yy';

describe('deterministic residue gear generalises — julian/mm-dd-yy', () => {
  const gear = compileGear(CAL, RECK, JULIAN_PI_PERIOD, '2000-01-01');

  it('compiles the expected residue structure over one Julian supercycle', () => {
    expect(gear.period).toBe(JULIAN_PI_PERIOD);
    expect(gear.residues.length).toBe(1); // one year ending in 15 per 100-year Julian period
    for (const r of gear.residues) {
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(JULIAN_PI_PERIOD);
    }
  });

  it('arithmetic witnesses equal the brute-force v1 scan on a shared range', () => {
    const startIso = '2000-01-01';
    const endIso = '2030-12-31';
    const fromGear = witnessJdns(gear, isoToJdn(startIso), isoToJdn(endIso));
    const fromScan = scan(startIso, endIso)
      .filter((d) => d.calendarId === CAL && d.reckoningId === RECK)
      .map((d) => d.jdn)
      .sort((a, b) => a - b);
    expect(fromGear).toEqual(fromScan);
    expect(fromGear.length).toBe(1); // Julian year 2015 → one π-day in the window
  });

  it('independent verifier accepts the emitted witness', () => {
    for (const t of witnessJdns(gear, isoToJdn('2000-01-01'), isoToJdn('2030-12-31'))) {
      expect(verifyWitness(t, CAL, RECK)).toBe(true);
    }
  });
});
