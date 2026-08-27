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
  const calendar = getCalendar(calendarId);
  const reckoning = listReckonings().find((r) => r.id === reckoningId);
  if (!calendar || !reckoning) return false;
  let fields;
  try {
    fields = calendar.fields(jdn);
  } catch {
    return false; // reader cannot reach this day (deep-time era limit) — cannot vouch for it here
  }
  return matchDepth(reckoning.read(fields, jdn).digits + clockDigits(reckoning)) >= reckoning.minDepth;
}
