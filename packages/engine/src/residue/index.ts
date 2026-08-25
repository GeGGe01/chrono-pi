// Deterministic residue engine: compile a (calendar, reckoning) π-reading to its periodic residue
// classes (Tågrälssatsen III), enumerate concrete witnesses arithmetically over any range, and verify
// each one independently. No raw-date scan in the witness path.
export { compileGear, type Gear } from './compile';
export { witnessJdns } from './witness';
export { verifyWitness } from './verify';
