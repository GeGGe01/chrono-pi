import { writeArtifacts } from './artifacts';

// Entry point for `pnpm --filter chrono-pi-data generate`: writes perfect-days.json and
// collisions.json into packages/data/generated/.
writeArtifacts();
console.log('Generated perfect-days.json, collisions.json and collision-searches.json');
