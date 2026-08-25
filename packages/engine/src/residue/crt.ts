import type { JDN } from '../types';
import type { Gear } from './compile';

// Correctness-critical supercycle arithmetic runs in BigInt: lcm of several calendar periods reaches
// ~10^15 (the deep-future triple witness), past the safe-integer range.

export function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return (a / gcd(a, b)) * (b < 0n ? -b : b);
}

function egcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x, y] = egcd(b, a % b);
  return [g, y, x - (a / b) * y];
}

function modInverse(a: bigint, m: bigint): bigint {
  const [g, x] = egcd(((a % m) + m) % m, m);
  if (g !== 1n) throw new Error(`no modular inverse of ${a} mod ${m}`);
  return ((x % m) + m) % m;
}

// A witness class t ≡ residue (mod modulus), canonical with 0 <= residue < modulus.
export interface WitnessClass {
  residue: bigint;
  modulus: bigint;
}

// Generalized CRT for two congruences (Kalenderkrockssatsen / Tågrälssatsen II, two systems). Returns
// the merged class modulo lcm(p1,p2), or null when incompatible — the pair is coherent iff
// r1 ≡ r2 (mod gcd(p1,p2)). This gcd filter is what turns a naive product count into the real one
// (the "36 not 396" discipline): not every (a,b) survives.
export function crtPair(r1: bigint, p1: bigint, r2: bigint, p2: bigint): WitnessClass | null {
  const g = gcd(p1, p2);
  if ((((r1 - r2) % g) + g) % g !== 0n) return null; // incompatible — no shared witness
  const l = lcm(p1, p2);
  const lp = p2 / g;
  const coeff = (p1 / g) % lp;
  const rhs = ((((r2 - r1) / g) % lp) + lp) % lp;
  const k = (modInverse(coeff, lp) * rhs) % lp;
  const t = (((r1 + p1 * k) % l) + l) % l;
  return { residue: t, modulus: l };
}

// The collision witness classes of two gears: every coherent residue pair, CRT-merged to a class modulo
// lcm of the periods (Tågrälssatsen III over two systems). |result| = the true number of collision
// classes per supercycle (N_J) — the count the gcd filter yields, not |A₁|·|A₂|.
export function collideGears(a: Gear, b: Gear): WitnessClass[] {
  const p1 = BigInt(a.period);
  const p2 = BigInt(b.period);
  const classes: WitnessClass[] = [];
  const seen = new Set<string>();
  for (const ra of a.residues) {
    for (const rb of b.residues) {
      const merged = crtPair(BigInt(ra), p1, BigInt(rb), p2);
      if (!merged) continue;
      const key = `${merged.residue}/${merged.modulus}`;
      if (seen.has(key)) continue;
      seen.add(key);
      classes.push(merged);
    }
  }
  return classes.sort((x, y) => (x.residue < y.residue ? -1 : x.residue > y.residue ? 1 : 0));
}

// Concrete collision JDNs in [startJdn, endJdn], enumerated arithmetically from the witness classes —
// no scan. Collisions are typically deep-time-sparse (mean interval lcm/N), so a normal range is often
// empty; that is correct, not a miss.
export function collisionJdns(classes: WitnessClass[], startJdn: JDN, endJdn: JDN): JDN[] {
  const start = BigInt(startJdn);
  const end = BigInt(endJdn);
  const out: bigint[] = [];
  for (const c of classes) {
    // smallest t = residue + m*modulus with t >= start (floor-safe ceil for BigInt)
    let m = (start - c.residue) / c.modulus;
    if (c.residue + m * c.modulus < start) m += 1n;
    for (let t = c.residue + m * c.modulus; t <= end; t += c.modulus) out.push(t);
  }
  return out.map(Number).sort((x, y) => x - y);
}
