import collisionsJson from '../generated/collisions.json';
import perfectDaysJson from '../generated/perfect-days.json';

import { collisionsArtifactSchema, perfectDaysArtifactSchema } from './schemas';
import type { CollisionsArtifact, PerfectDaysArtifact } from './types';

// Typed, validated access to the committed artifacts for build-time consumers (the site). Parsing
// through the schema means a malformed artifact fails the consumer's build rather than passing silently.
export function getPerfectDays(): PerfectDaysArtifact {
  return perfectDaysArtifactSchema.parse(perfectDaysJson);
}

export function getCollisions(): CollisionsArtifact {
  return collisionsArtifactSchema.parse(collisionsJson);
}
