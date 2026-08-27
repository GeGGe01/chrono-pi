import { describe, expect, it } from 'vitest';

import { isoToJdn } from '../src/jdn';
import { compileGear, verifyWitness } from '../src/residue';
import { collideGears, collisionJdns } from '../src/residue/crt';

// The flagship deep-future double (packages/data/src/artifacts.ts): 2197415-03-14, a Gregorian ∩ Islamic
// day on which both calendars read π — a witness ~2.2 million years out that no bounded scan could ever
// reach. Two engine properties make it tractable at that depth, and this test pins both:
//   1. Both readers are pure arithmetic over the JDN (Gregorian via jdn.ts, Islamic tabular over its
//      30-year cycle), so neither hits Temporal's ~year-275760 ceiling.
//   2. The witness is enumerated from the two gears' residue classes via CRT — never by scanning days.
const GREG = 'gregorian';
const ISL = 'islamic';
const RECK_GREG = 'gregorian/mm-dd-yy';
const RECK_ISL = 'islamic/mm-dd-yy';

// Islamic mm-dd-yy repeats over 300 tabular years: the 30-year leap cycle (10631 days) aligns with the
// 100-year period of `year % 100` at lcm(30, 100) = 300 years = 10 × 10631 = 106310 days.
const ISLAMIC_PERIOD = 106310;
const GREGORIAN_PERIOD = 146097;

describe('CRT reproduces the flagship Gregorian ∩ Islamic witness (2197415-03-14)', () => {
  const greg = compileGear(GREG, RECK_GREG, GREGORIAN_PERIOD, '2000-01-01');
  const isl = compileGear(ISL, RECK_ISL, ISLAMIC_PERIOD, '2000-01-01');
  const witness = isoToJdn('2197415-03-14');

  it('both calendars independently read π on the flagship day at deep time', () => {
    // verifyWitness recomputes from the readers, independent of the CRT path — the correctness boundary.
    expect(verifyWitness(witness, GREG, RECK_GREG)).toBe(true);
    expect(verifyWitness(witness, ISL, RECK_ISL)).toBe(true);
  });

  it('the Islamic gear compiles to a non-empty residue set over its 300-year supercycle', () => {
    expect(isl.period).toBe(ISLAMIC_PERIOD);
    expect(isl.residues.length).toBeGreaterThan(0);
    // the witness day lands in the gear's residue set (positive JDN, so a plain modulo suffices)
    expect(isl.residues).toContain(witness % ISLAMIC_PERIOD);
    expect(greg.residues).toContain(witness % GREGORIAN_PERIOD);
  });

  it('the CRT collision classes enumerate the flagship witness — from residues alone, no scan', () => {
    const classes = collideGears(greg, isl);
    expect(classes.length).toBeGreaterThan(0);
    const found = collisionJdns(classes, isoToJdn('2197000-01-01'), isoToJdn('2198000-01-01'));
    expect(found).toContain(witness);
  });
});
