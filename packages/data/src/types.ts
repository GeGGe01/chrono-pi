import type { z } from 'zod';

import type {
  collisionSearchesArtifactSchema,
  collisionSearchSchema,
  collisionsArtifactSchema,
  perfectDaysArtifactSchema,
  witnessSchema,
} from './schemas';

// The data package's output types: the engine's contract types for the rows, plus the artifact
// envelopes inferred from the zod schemas so the types and the validators can never drift.
export type { Collision, PerfectDay, Tier } from 'chrono-pi-engine';

export type Witness = z.infer<typeof witnessSchema>;
export type CollisionSearch = z.infer<typeof collisionSearchSchema>;
export type CollisionSearchesArtifact = z.infer<typeof collisionSearchesArtifactSchema>;
export type PerfectDaysArtifact = z.infer<typeof perfectDaysArtifactSchema>;
export type CollisionsArtifact = z.infer<typeof collisionsArtifactSchema>;
