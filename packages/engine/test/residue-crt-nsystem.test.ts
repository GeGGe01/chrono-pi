import { describe, expect, it } from 'vitest';

import type { Gear } from '../src/residue/compile';
import { collideGears, collideGearsN, compileGear, lcm } from '../src/residue';

// A bare gear literal — collideGearsN only reads `period` and `residues`, so small hand-chosen sets let
// us check the N-system fold against brute-force truth.
function fakeGear(period: number, residues: number[]): Gear {
  return { calendarId: `c${period}`, reckoningId: `c${period}/x`, period, residues };
}

// The ground truth, computed the slow honest way: every t in [0, lcm) that satisfies EVERY gear's
// residue set. This is exactly what the CRT fold must reproduce arithmetically, without the scan.
function bruteResidues(gears: Gear[]): bigint[] {
  let L = 1n;
  for (const g of gears) L = lcm(L, BigInt(g.period));
  const out: bigint[] = [];
  for (let t = 0n; t < L; t += 1n) {
    if (gears.every((g) => g.residues.includes(Number(t % BigInt(g.period))))) out.push(t);
  }
  return out;
}

describe('N-system CRT (Tågrälssatsen III generalized to N)', () => {
  it('a three-gear fold matches brute force over the supercycle (the gcd filter across 3 systems)', () => {
    const gears = [fakeGear(4, [1, 2]), fakeGear(6, [3, 0]), fakeGear(9, [8, 1])];
    const L = lcm(lcm(4n, 6n), 9n); // 36
    const classes = collideGearsN(gears);
    expect(classes.map((c) => c.residue)).toEqual(bruteResidues(gears));
    expect(classes.every((c) => c.modulus === L)).toBe(true);
  });

  it('is never the naive product — incompatible tuples drop', () => {
    // g1 forces t≡0 (mod 2), g2 forces t≡1 (mod 2): no coherent t, so zero classes despite 1×1 product.
    expect(collideGearsN([fakeGear(2, [0]), fakeGear(4, [1])])).toEqual([]);
    // full-product only when every tuple is coprime-compatible
    const co = collideGearsN([fakeGear(2, [1]), fakeGear(3, [2]), fakeGear(5, [4])]);
    expect(co.length).toBe(1); // one class mod 30
    expect(co[0]!.modulus).toBe(30n);
  });

  it('fold order does not change the result (associativity of the CRT merge)', () => {
    const a = fakeGear(4, [1, 2]);
    const b = fakeGear(6, [3, 0]);
    const c = fakeGear(9, [8, 1]);
    const abc = collideGearsN([a, b, c]).map((x) => x.residue);
    const cab = collideGearsN([c, a, b]).map((x) => x.residue);
    expect(cab).toEqual(abc);
  });

  it('the two-gear case equals collideGears exactly (pairwise is the N=2 fold)', () => {
    const a = fakeGear(146097 % 997, [3, 17, 200]);
    const b = fakeGear(36525 % 991, [3, 40]);
    expect(collideGearsN([a, b])).toEqual(collideGears(a, b));
  });

  it('degenerate arities: empty → none, single → its own residue classes', () => {
    expect(collideGearsN([])).toEqual([]);
    const single = collideGearsN([fakeGear(7, [5, 2])]);
    expect(single.map((c) => c.residue).sort()).toEqual([2n, 5n]);
    expect(single.every((c) => c.modulus === 7n)).toBe(true);
  });

  it('real three-calendar fold: Gregorian × Julian × Islamic classes satisfy all three gears', () => {
    const greg = compileGear('gregorian', 'gregorian/mm-dd-yy', 146097, '2000-01-01');
    const jul = compileGear('julian', 'julian/mm-dd-yy', 36525, '2000-01-01');
    const isl = compileGear('islamic', 'islamic/mm-dd-yy', 106310, '2000-01-01');
    const L = lcm(lcm(146097n, 36525n), 106310n);
    const classes = collideGearsN([greg, jul, isl]);
    for (const c of classes) {
      expect(c.modulus).toBe(L);
      expect(greg.residues).toContain(Number(c.residue % 146097n));
      expect(jul.residues).toContain(Number(c.residue % 36525n));
      expect(isl.residues).toContain(Number(c.residue % 106310n));
    }
    // and it is bounded by the naive product — the gcd filter never invents classes
    expect(classes.length).toBeLessThanOrEqual(greg.residues.length * jul.residues.length * isl.residues.length);
  });
});
