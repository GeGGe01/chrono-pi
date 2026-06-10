import { beforeAll, describe, expect, it } from 'vitest';

import { getCalendar } from '../src/calendars/registry';
import { isoToJdn } from '../src/jdn';
import { scan, seedDefaults } from '../src/scan';
import { REFERENCE_ENTRIES, type ReferenceEntry } from './fixtures/reference-table';
import { VARIANCES } from './fixtures/variances';

// (calendar/format) pairs the engine is expected to reproduce at this point in the Phase 2 build.
// The set grows as each batch lands; everything else is reported pending, not failed.
const IMPLEMENTED = new Set([
  'gregorian/mm-dd-yy',
  'gregorian/yy-m-dd',
  'julian/mm-dd-yy',
  'julian/yy-m-dd',
  'holocene/mm-dd-yy',
  'holocene/yy-m-dd',
  'hebrew/mm-dd-yy',
  'hebrew/yy-m-dd',
  'persian/mm-dd-yy',
  'persian/yy-m-dd',
  'islamic/mm-dd-yy',
  'islamic/yy-m-dd',
]);

const pairKey = (entry: ReferenceEntry): string => `${entry.calendar}/${entry.format}`;
const entryKey = (entry: ReferenceEntry): string => `${entry.isoDate}/${entry.calendar}/${entry.format}`;

beforeAll(() => {
  seedDefaults();
});

function engineReads(entry: ReferenceEntry) {
  const reckoningId = `${entry.calendar}/${entry.format}`;
  return scan(entry.isoDate, entry.isoDate).find(
    (day) =>
      day.calendarId === entry.calendar &&
      day.reckoningId === reckoningId &&
      day.digits.startsWith(entry.sequence),
  );
}

describe('reference table regression', () => {
  for (const entry of REFERENCE_ENTRIES) {
    const title = `${entry.isoDate} ${entry.calendar}/${entry.format} → ${entry.sequence}`;

    if (VARIANCES.has(entryKey(entry))) {
      it.skip(`[variance] ${title}`, () => {});
      continue;
    }
    if (!IMPLEMENTED.has(pairKey(entry))) {
      it.skip(`[pending] ${title}`, () => {});
      continue;
    }

    it(title, () => {
      const read = engineReads(entry);
      expect(read, `engine should read π for ${title}`).toBeDefined();
      expect(read?.depth).toBeGreaterThanOrEqual(entry.sequence.length);
      expect(getCalendar(entry.calendar)?.fields(isoToJdn(entry.isoDate)).year).toBe(entry.fullYear);
    });
  }

  it('reports coverage of the encoded reference rows', () => {
    let reproduced = 0;
    let variance = 0;
    let pending = 0;
    for (const entry of REFERENCE_ENTRIES) {
      if (VARIANCES.has(entryKey(entry))) variance += 1;
      else if (IMPLEMENTED.has(pairKey(entry))) reproduced += 1;
      else pending += 1;
    }
    console.log(
      `reference coverage: ${reproduced} reproduced, ${variance} variance, ${pending} pending ` +
        `of ${REFERENCE_ENTRIES.length} encoded rows`,
    );
    expect(reproduced + variance + pending).toBe(REFERENCE_ENTRIES.length);
  });
});
