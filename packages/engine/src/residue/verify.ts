import { clockDigits } from '../clock';
import { getCalendar } from '../calendars/registry';
import { matchDepth } from '../pi';
import { listReckonings } from '../reckonings/registry';
import { seedDefaults } from '../scan';
import type { JDN } from '../types';

// The independent correctness boundary (handover §8). Given a claimed witness JDN, recompute the
// reading straight from the calendar + reckoning and confirm it truly reads π to depth — WITHOUT using
// the residue/CRT path that produced it. A witness the search emits but the verifier rejects is a bug
// in the search, by construction: the two paths share no code beyond the calendar readers.
export function verifyWitness(jdn: JDN, calendarId: string, reckoningId: string): boolean {
  seedDefaults();
  const reckoning = listReckonings().find((r) => r.id === reckoningId);
  if (!reckoning) return false;
  return readDepth(jdn, calendarId, reckoningId) >= reckoning.minDepth;
}

// The π-prefix depth a (calendar, reckoning) reads on a given day — the raw number verifyWitness
// thresholds against minDepth. Returns -1 when the reader cannot reach the day or the ids are unknown.
// Same independent path (no residue/CRT), so it doubles as the game's read primitive for witness profiles.
export function readDepth(jdn: JDN, calendarId: string, reckoningId: string): number {
  seedDefaults();
  const calendar = getCalendar(calendarId);
  const reckoning = listReckonings().find((r) => r.id === reckoningId);
  if (!calendar || !reckoning) return -1;
  let fields;
  try {
    fields = calendar.fields(jdn);
  } catch {
    return -1; // reader cannot reach this day (deep-time era limit)
  }
  return matchDepth(reckoning.read(fields, jdn).digits + clockDigits(reckoning));
}
