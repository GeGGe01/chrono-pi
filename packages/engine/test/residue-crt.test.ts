import { describe, expect, it } from 'vitest';

import { compileGear } from '../src/residue';
import { collideGears, collisionJdns, crtPair, gcd, lcm } from '../src/residue/crt';

describe('two-system CRT core', () => {
  it('gcd / lcm', () => {
    expect(gcd(146097n, 36525n)).toBe(3n);
    expect(lcm(146097n, 36525n)).toBe(1_778_730_975n);
    expect(gcd(0n, 5n)).toBe(5n);
    expect(lcm(0n, 5n)).toBe(0n);
  });

  it('crtPair merges compatible congruences and rejects incompatible ones', () => {
    // t ≡ 2 (mod 3), t ≡ 3 (mod 5) → t ≡ 8 (mod 15)
    expect(crtPair(2n, 3n, 3n, 5n)).toEqual({ residue: 8n, modulus: 15n });
    // coprime moduli: always compatible; verify the merged class satisfies both
    const m = crtPair(1n, 4n, 2n, 9n)!;
    expect(m.modulus).toBe(36n);
    expect(m.residue % 4n).toBe(1n);
    expect(m.residue % 9n).toBe(2n);
    // incompatible: t ≡ 0 (mod 2), t ≡ 1 (mod 4) — differ mod gcd(2,4)=2
    expect(crtPair(0n, 2n, 1n, 4n)).toBeNull();
  });
});

describe('gregorian × julian π-collision (Kalenderkrockssatsen via CRT)', () => {
  const greg = compileGear('gregorian', 'gregorian/mm-dd-yy', 146097, '1600-01-01');
  const jul = compileGear('julian', 'julian/mm-dd-yy', 36525, '2000-01-01');

  it('collision classes are exactly the gcd-compatible residue pairs (the 36-not-396 filter)', () => {
    const g = Number(gcd(BigInt(greg.period), BigInt(jul.period))); // 3
    // Independently count compatible (a,b): a ≡ b (mod gcd). This is the truth the gcd filter must yield.
    let expected = 0;
    for (const a of greg.residues) for (const b of jul.residues) if (((a - b) % g + g) % g === 0) expected += 1;
    const classes = collideGears(greg, jul);
    expect(classes.length).toBe(expected);
    // never the naive product unless every pair happens to be compatible
    expect(classes.length).toBeLessThanOrEqual(greg.residues.length * jul.residues.length);
  });

  it('every collision class truly lies in both gears’ residue sets', () => {
    for (const c of collideGears(greg, jul)) {
      expect(c.modulus).toBe(1_778_730_975n); // lcm(146097, 36525)
      expect(greg.residues).toContain(Number(c.residue % BigInt(greg.period)));
      expect(jul.residues).toContain(Number(c.residue % BigInt(jul.period)));
    }
  });

  it('collisionJdns enumerates a class witness that satisfies both congruences', () => {
    const classes = collideGears(greg, jul);
    if (classes.length === 0) return; // no coherent pair → no collision (a valid outcome)
    const c = classes[0]!;
    const t = Number(c.residue); // the class representative itself is a witness in [residue, residue]
    const found = collisionJdns([c], t, t);
    expect(found).toEqual([t]);
    expect(greg.residues).toContain(((t % greg.period) + greg.period) % greg.period);
    expect(jul.residues).toContain(((t % jul.period) + jul.period) % jul.period);
  });
});
