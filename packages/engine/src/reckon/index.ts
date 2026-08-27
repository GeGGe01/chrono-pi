// The Reckoning — the deterministic merge-driven search game (docs/RECKONING.md). A pure function from a
// merge descriptor to a bounded, guarded, reproducible search for perfect π-days. No CI/git/clock here.
export { reckon, SEASON0 } from './reckon';
export type { ReckonInput, ReckonResult, Catch, Reading, Direction } from './reckon';
export { fortunes } from './fortunes';
export type { MergeFacts, Fortune, FortuneResult } from './fortunes';
