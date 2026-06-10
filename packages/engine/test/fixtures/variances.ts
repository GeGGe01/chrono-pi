// Recorded variances, keyed by `${isoDate}/${calendar}/${format}`: rows the engine does not reproduce,
// each with a documented reason. A variance is an expected, recorded mismatch — not a test failure. As
// batches resolve them, entries leave this ledger. See docs/reference-table.md and the Phase 2 design.

const UNIX =
  'The midnight-second model reaches only depth 6; the perfect second 3141592653.589 falls mid-day ' +
  '(00:37:33.589). The instant-aware timestamp batch resolves it.';

const PERSIAN =
  "ICU's 33-year arithmetic Solar Hijri runs one day ahead of the table after ~2025 (the leap-cycle " +
  'divergence). The table used a different leap rule; ICU has no second Persian variant to pin.';

const HEBREW =
  "ICU's deterministic Hebrew calendar gives a different day/month than the table here (one day to " +
  '~one month in the far future). ICU Hebrew is authoritative, so the table value is the recorded side.';

const ISLAMIC =
  "ICU islamic-civil differs from the table by one to five days here; tabular-Islamic leap-set choices " +
  'diverge over centuries. Civil reproduces the near-term rows, so it is the pinned variant.';

export const VARIANCES = new Map<string, string>([
  ['2069-07-21/unix/timestamp', UNIX],

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
]);
