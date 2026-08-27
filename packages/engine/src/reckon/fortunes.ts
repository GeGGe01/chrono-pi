// The fortunes (docs/RECKONING.md §3a): arbitrary, deterministic, not-your-fault multipliers on the
// clock. Everything is evaluated in UTC so the game is identical for everyone, wherever they live.

export interface MergeFacts {
  sha: string; // merge commit sha (hex)
  timestampUtc: string; // ISO 8601 timestamp of the merge commit, interpreted as UTC
  commits: number; // commit count in the merge (the clock)
  parents: number; // parent count (>1 ⇒ a merge commit)
  touchesLockfile: boolean; // the diff touches a lockfile (pnpm-lock.yaml / *-lock)
  hasCrlfOrTrailingWs: boolean; // the diff introduces CRLF or trailing whitespace
}

export interface Fortune {
  name: string;
  factor: number; // <1 penalty, >1 bonus
}

export interface FortuneResult {
  applied: Fortune[];
  product: number; // ∏ factor
  legendary: boolean; // 03:14:15 UTC ⇒ f' pinned to MAX_TURNS regardless of product
}

function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i += 1) if (n % i === 0) return false;
  return true;
}

// Compute the fortune factors for a merge. Pure and deterministic — the timestamp drives every
// time-based fortune, always read in UTC.
export function fortunes(m: MergeFacts): FortuneResult {
  const d = new Date(m.timestampUtc);
  const weekday = d.getUTCDay(); // 0 Sun … 6 Sat
  const hour = d.getUTCHours();
  const minute = d.getUTCMinutes();
  const second = d.getUTCSeconds();
  const month = d.getUTCMonth() + 1; // 1-based
  const day = d.getUTCDate();

  const applied: Fortune[] = [];
  const add = (name: string, factor: number) => applied.push({ name, factor });

  // Penalties — misfortunes that aren't the committer's fault.
  if (weekday === 5) add('friday', 0.25);
  if (weekday === 0) add('sunday', 0.5);
  if (m.touchesLockfile) add('lockfile', 0.5);
  if (m.parents > 1) add('merge-commit', 0.75);
  if (m.hasCrlfOrTrailingWs) add('crlf-or-trailing-ws', 0.75);
  if (m.commits % 2 === 0) add('even-commits', 0.9);

  // Bonuses — fortunes that aren't the committer's credit either.
  const piHour = (hour === 3 || hour === 15) && minute === 14; // 3:14 am/pm
  if (piHour) add('pi-hour-0314', 3.14);
  const legendary = piHour && second === 15; // 03:14:15 → 31415
  if (weekday === 3 && hour === 14) add('wednesday-14', 2); // day 3 · hour 14 = "3·14"
  if (month === 3 && day === 14) add('pi-day', 3.14); // 03-14
  if (hour === 9 && minute === 26) add('pi-instant-0926', 1.5); // canonical π-instant minute
  if (m.sha.toLowerCase().includes('314')) add('sha-314', 1.5);
  if (isPrime(m.commits)) add('prime-commits', 1.2);

  const product = applied.reduce((p, f) => p * f.factor, 1);
  return { applied, product, legendary };
}
