// Recorded variances, keyed by `${isoDate}/${calendar}/${format}`: rows the engine does not reproduce,
// each with a documented reason. A variance is an expected, recorded mismatch — not a test failure. As
// batches resolve them, entries leave this ledger. See docs/reference-table.md and the Phase 2 design.

const PERSIAN =
  "ICU's 33-year arithmetic Solar Hijri runs one day ahead of the table after ~2025 (the leap-cycle " +
  'divergence). The table used a different leap rule; ICU has no second Persian variant to pin.';

const HEBREW =
  "ICU's deterministic Hebrew calendar gives a different day/month than the table here (one day to " +
  '~one month in the far future). ICU Hebrew is authoritative, so the table value is the recorded side.';

const ISLAMIC =
  "ICU islamic-civil differs from the table by one to five days here; tabular-Islamic leap-set choices " +
  'diverge over centuries. Civil reproduces the near-term rows, so it is the pinned variant.';

const COPTIC =
  'Standard Coptic (Anno Martyrum, year≡3 leap) reproduces the table\'s consistent rows; these diverge ' +
  "by ±1 day, and 1838's year value (1531) conflicts with the table's own 284-epoch rows — an apparent " +
  'table error (Coptic 1838 is year 1555).';

const ETHIOPIC =
  "Standard Ethiopic reproduces the table's December rows; the March rows read month 7 (Mägabit) " +
  "astronomically, not the table's month 3 — an apparent month error in the table. 1838/2138 are ±1 day.";

export const VARIANCES = new Map<string, string>([
  ['2036-06-04/persian/mm-dd-yy', PERSIAN],
  ['2052-07-06/persian/yy-m-dd', PERSIAN],
  ['2136-06-04/persian/mm-dd-yy', PERSIAN],
  ['2152-07-06/persian/yy-m-dd', PERSIAN],

  ['2054-12-14/hebrew/mm-dd-yy', HEBREW],
  ['2071-01-17/hebrew/yy-m-dd', HEBREW],
  ['2154-12-11/hebrew/mm-dd-yy', HEBREW],
  ['2171-01-13/hebrew/yy-m-dd', HEBREW],

  ['1994-08-22/islamic/mm-dd-yy', ISLAMIC],
  ['2107-04-05/islamic/yy-m-dd', ISLAMIC],
  ['2188-09-05/islamic/mm-dd-yy', ISLAMIC],
  ['2204-04-12/islamic/yy-m-dd', ISLAMIC],

  ['1838-12-24/coptic/yy-m-dd', COPTIC],
  ['1898-11-23/coptic/mm-dd-yy', COPTIC],
  ['2114-12-24/coptic/yy-m-dd', COPTIC],
  ['2198-11-23/coptic/mm-dd-yy', COPTIC],
  ['2214-12-24/coptic/yy-m-dd', COPTIC],

  ['1838-12-24/ethiopic/yy-m-dd', ETHIOPIC],
  ['1923-03-23/ethiopic/mm-dd-yy', ETHIOPIC],
  ['2023-03-23/ethiopic/mm-dd-yy', ETHIOPIC],
  ['2123-03-23/ethiopic/mm-dd-yy', ETHIOPIC],
  ['2138-12-24/ethiopic/yy-m-dd', ETHIOPIC],
  ['2223-03-23/ethiopic/mm-dd-yy', ETHIOPIC],
]);
