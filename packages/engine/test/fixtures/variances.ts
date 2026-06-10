// Recorded variances: (calendar/format) pairs the engine does not yet reproduce, each with a reason.
// A variance is an expected, documented mismatch — not a test failure. As batches resolve them, entries
// move out of this ledger. See docs/reference-table.md and the Phase 2 design.
export const VARIANCES = new Map<string, string>([
  [
    'unix/timestamp',
    'The midnight-second model reaches only depth 6; the perfect second 3141592653.589 falls mid-day ' +
      '(00:37:33.589). The instant-aware timestamp batch resolves it.',
  ],
]);
