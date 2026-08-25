import { describe, expect, it } from 'vitest';

import { isoToJdn } from '../src/jdn';
import { compileGear, verifyWitness } from '../src/residue';
import { collideGears, collisionJdns } from '../src/residue/crt';

// The known historical Gregorian ∩ Julian double (packages/data/src/artifacts.ts): a real witness where
// both calendars read π on the same day. Gregorian and Julian nearly coincide around 200 CE, so their
// π-days can land on the same JDN — exactly what the CRT collision must reproduce from residues alone.
const GREG = 'gregorian';
const JUL = 'julian';
const RECK_GREG = 'gregorian/mm-dd-yy';
const RECK_JUL = 'julian/mm-dd-yy';

describe('CRT collision reproduces the known Gregorian ∩ Julian witness (0215-03-14)', () => {
  const greg = compileGear(GREG, RECK_GREG, 146097, '1600-01-01');
  const jul = compileGear(JUL, RECK_JUL, 36525, '2000-01-01');
  const classes = collideGears(greg, jul);
  const witness = isoToJdn('0215-03-14');

  it('both calendars independently read π on the witness day', () => {
    expect(verifyWitness(witness, GREG, RECK_GREG)).toBe(true);
    expect(verifyWitness(witness, JUL, RECK_JUL)).toBe(true);
  });

  it('the CRT collision classes — from residues alone — enumerate the witness in its era', () => {
    const found = collisionJdns(classes, isoToJdn('0200-01-01'), isoToJdn('0230-12-31'));
    expect(found).toContain(witness);
    // and the witness satisfies both gears' residue congruences (the collision is real, not incidental)
    expect(greg.residues).toContain(((witness % greg.period) + greg.period) % greg.period);
    expect(jul.residues).toContain(((witness % jul.period) + jul.period) % jul.period);
  });
});
