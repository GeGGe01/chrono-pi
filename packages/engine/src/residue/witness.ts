import type { JDN } from '../types';
import type { Gear } from './compile';

// Every concrete witness JDN in [startJdn, endJdn], generated ARITHMETICALLY from the gear's residue
// classes — no per-day scan, no calendar reads. Each class t ≡ a (mod P) contributes t = a + mP for the
// integers m that land in range (Tågrälssatsen-III enumeration). Works for any range, including deep
// time far beyond a calendar reader's era, because it never touches the reader. Result is sorted.
export function witnessJdns(gear: Gear, startJdn: JDN, endJdn: JDN): JDN[] {
  const out: JDN[] = [];
  if (endJdn < startJdn) return out;
  const { period } = gear;
  for (const a of gear.residues) {
    // smallest t = a + mP with t >= startJdn
    const first = a + Math.ceil((startJdn - a) / period) * period;
    for (let t = first; t <= endJdn; t += period) out.push(t);
  }
  return out.sort((x, y) => x - y);
}
