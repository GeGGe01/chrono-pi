import { clockDigits } from '../clock';
import { getCalendar } from '../calendars/registry';
import { isoToJdn } from '../jdn';
import { matchDepth } from '../pi';
import { listReckonings } from '../reckonings/registry';
import { seedDefaults } from '../scan';
import type { CalendarFields, JDN } from '../types';

// A compiled π-gear: one (calendar, reckoning) reading reduced to its periodic residue structure.
// `residues` is the active set A ⊆ Z/period — the JDN residues on which the reading reaches π to the
// reckoning's minimum depth. This is the Tågrälssatsen-III object: a finite witness representation of
// an infinite axis. After compilation, witnesses over any range are pure arithmetic (see witness.ts) —
// the engine never scans the full supercycle L.
export interface Gear {
  calendarId: string;
  reckoningId: string;
  period: number; // supercycle P, in whole JDN days
  residues: number[]; // active residues, canonical: sorted ascending, each in [0, period)
}

// Compile A by reading EXACTLY ONE period with the proven v1 reader, then reducing each perfect day's
// JDN modulo period. Cost is bounded to one supercycle of a single gear — not a range scan, not every
// reckoning. `baseIso` must sit inside the reader's supported era (Temporal-backed calendars throw in
// deep time; a one-period window in a normal era avoids that — deep-time reads are witness.ts's job via
// arithmetic, and an arithmetic reader is a later slice).
export function compileGear(
  calendarId: string,
  reckoningId: string,
  period: number,
  baseIso: string,
): Gear {
  if (!Number.isInteger(period) || period <= 0) {
    throw new Error(`period must be a positive integer, got ${period}`);
  }
  seedDefaults();
  const calendar = getCalendar(calendarId);
  const reckoning = listReckonings().find((r) => r.id === reckoningId);
  if (!calendar) throw new Error(`unknown calendar: ${calendarId}`);
  if (!reckoning) throw new Error(`unknown reckoning: ${reckoningId}`);
  if (reckoning.calendarId !== calendarId) {
    throw new Error(`reckoning ${reckoningId} is not declared against calendar ${calendarId}`);
  }

  const clock = clockDigits(reckoning);
  const startJdn = isoToJdn(baseIso);
  const residues = new Set<number>();

  for (let jdn: JDN = startJdn; jdn < startJdn + period; jdn += 1) {
    let fields: CalendarFields;
    try {
      fields = calendar.fields(jdn);
    } catch {
      continue; // reader beyond its supported era — must not happen inside a well-chosen in-era window
    }
    const digits = reckoning.read(fields, jdn).digits + clock;
    if (matchDepth(digits) >= reckoning.minDepth) {
      residues.add(((jdn % period) + period) % period);
    }
  }

  return {
    calendarId,
    reckoningId,
    period,
    residues: [...residues].sort((a, b) => a - b),
  };
}
