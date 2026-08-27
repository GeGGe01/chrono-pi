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

// Canonical ordering of witness classes by ascending residue — the stable output order everywhere.
function byResidue(x: WitnessClass, y: WitnessClass): number {
  return x.residue < y.residue ? -1 : x.residue > y.residue ? 1 : 0;
}

// Fold one more gear into an existing set of witness classes: each coherent (class, residue) pair
// CRT-merges to a class modulo lcm(class.modulus, gear.period); incompatible pairs drop (the gcd
// filter, applied at every step). Deduped and canonically ordered.
function foldGear(classes: WitnessClass[], gear: Gear): WitnessClass[] {
  const p = BigInt(gear.period);
  const out: WitnessClass[] = [];
  const seen = new Set<string>();
  for (const c of classes) {
    for (const r of gear.residues) {
      const merged = crtPair(c.residue, c.modulus, BigInt(r), p);
      if (!merged) continue;
      const key = `${merged.residue}/${merged.modulus}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(merged);
    }
  }
  return out.sort(byResidue);
}

// The collision witness classes across N gears (Tågrälssatsen III, N systems): fold the gcd-compatible
// CRT merge across every gear. |result| is the true number of collision classes per supercycle
// lcm(P₁..Pₙ) — the gcd filter applied at each fold, never the naive product |A₁|·…·|Aₙ| (the "36 not
// 396" discipline generalizes to N). Empty list → no classes; a single gear → its own residue classes.
export function collideGearsN(gears: readonly Gear[]): WitnessClass[] {
  if (gears.length === 0) return [];
  const [first, ...rest] = gears;
  const p0 = BigInt(first.period);
  const seen = new Set<string>();
  let classes: WitnessClass[] = [];
  for (const r of first.residues) {
    const residue = ((BigInt(r) % p0) + p0) % p0;
    const key = `${residue}/${p0}`;
    if (seen.has(key)) continue;
    seen.add(key);
    classes.push({ residue, modulus: p0 });
  }
  classes.sort(byResidue);
  for (const gear of rest) classes = foldGear(classes, gear);
  return classes;
}

// The collision witness classes of two gears (Tågrälssatsen III over two systems) — the pairwise case
// of collideGearsN. |result| = the true number of collision classes per supercycle, not |A₁|·|A₂|.
export function collideGears(a: Gear, b: Gear): WitnessClass[] {
  return collideGearsN([a, b]);
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
