# The Reckoning — a deterministic search game over the merge history

> **Status:** design-first proposal. No engine or CI code lands until the parameters here are settled.
> This document is the rulebook's *design*; the rulebook's *data* (allowed conventions + conversions)
> is append-only (see §7).

A merge to `main` is a **search**. The engine already finds perfect π-days deterministically; this turns
that search into a small, un-gameable game where the **commit** — never the person — is what lands a day.

The whole point: it can run **unattended**, and no one can adapt their working style to farm it, because the
inputs are things you can't fake naturally (commit count, additions vs deletions) and the rulebook is
append-only, so a past catch is valid forever.

---

## 1. One win: a day is a day

A **catch** is a verified **perfect π-day** — a day whose calendar fields, read under an *allowed
convention*, spell π to at least the qualifying depth (5: `31415`), confirmed by the independent verifier.

Single, double, triple — **irrelevant to the win**. Multiplicity is a *property* of the caught day (its
richness, its score), never the gate. A day is a day.

---

## 2. The board and its bounds (the safety answer)

The search axis is the JDN line. The game only ever touches a **finite safe band**
`[SAFE_MIN, SAFE_MAX]` chosen so that:

- all arithmetic stays exact (`SAFE_MAX < 2^53`, so no silent float drift),
- only **deep-time-safe arithmetic gears** run (Gregorian, Julian, tabular Hijri, cyclic-33y Persian) —
  never a Temporal-backed calendar that shatters past its era.

Boundedness is the containment for the *unstable search space* the security notices flagged: no infinities,
no division by zero, no degenerate moduli, no overflow. Guards run before every search — every period `> 0`,
residues `⊆ [0, P)`, `start ≤ stop`, `stop < 2^53`. A degenerate case is skipped and logged (**void**),
never crashed.

---

## 3. The clock: commits are the frequency (CPU-like)

A merge does **not** yield one boring search. It runs a **triple-helix** that spirals many turns, and the
merge's **commit count is the clock rate**:

```
f  =  clamp(commits, 1, MAX_TURNS)          // commits in the merge = frequency = helix turns
```

`f` is the search's **lifespan and nothing else** — how many turns the helix is allowed to spiral this
cycle. More commits → higher frequency → the helix reaches further → more chance of a catch (never a
guarantee). `MAX_TURNS` caps it so a giant squash-merge can't run forever (this is the anti-*slack* guard).

You can't cheaply fake a natural commit cadence, so the clock is hard to game.

---

## 4. The direction: additions vs deletions choose the era (BC / AD)

The merge diff picks which way the helix spirals. Let `A` = additions, `D` = deletions.

```
AD  (forward, toward the deep future)   if   D  <  0.1 · A        // deletions under a tenth of additions
BC  (backward, toward antiquity)        if   10 · D  ≥  A         // deletions a tenth or more
```

*(Rounding: compare `ROUND(10·D)` against `ROUND(A)`, ±0.5 tolerance at the boundary. `A = 0` → void.)*

Building (net additions) drives you into the future; pruning (heavy deletions) digs into the past. Your
commit's *shape* steers the search, and — like the clock — it's hard to fabricate on purpose.

> **Confirmed:** the threshold is `D = 0.1·A` — a healthy PR is ~90% additions, so the default (net-additive)
> commit reads AD, and only a deletion-heavy PR (≥10% deletions) flips it to BC. `DIRECTION_RATIO` (§9) is
> still tunable, but `0.1` is the settled default.

---

## 5. The triple-helix search

Three strands, braided — the three **allowed date-orderings** (the reckoning formats):

| Strand | Ordering | Example |
|---|---|---|
| I | `mm-dd-yy` (American middle-endian) | `3/14/15 → 31415` |
| II | `yy-m-dd` (inverted little-endian) | `31/4/15 → 31415` |
| III | `yyyy-mm-dd` (ISO big-endian) | `3141/5/9 → 314159` |

```
seed   = int(mergeSha[:12], 16)
start  = SAFE_MIN + (seed mod SAFE_SPAN)                     // deterministic-random position
reach  = f · PITCH                                           // f turns × per-turn span
window = [start, start + dir·reach] ∩ [SAFE_MIN, SAFE_MAX]   // dir = +1 (AD) or −1 (BC)
```

Over `window`, each whitelisted gear's residue classes enumerate its π-days **arithmetically** (no scan) for
all three strands. The helix *spins* `f` turns as flavour and lifespan; the *finding* is exact number theory.
**Merge ⇒ guaranteed search. Catch ⇒ chance.**

---

## 6. On a catch: read every calendar (cheap, un-cherry-pickable)

When a JDN is confirmed a perfect π-day, **read every calendar at that JDN**, not just the strand that
caught it. It's one field-read + one π-match per calendar — cheap — and it means nobody can cherry-pick which
calendars "count." The day is recorded with its **full profile**: every calendar that also reads π there,
and to what depth — revealing whether the day is single, double, triple, …

The only skips are **obvious lockouts**: a calendar pair whose periods are structurally gcd-incompatible can
never co-read, so pairing them as a "collision" is ugly and pointless — those pairings are not claimed
(the per-calendar read still happens; only the impossible *pairing* is suppressed).

The catch is written to the ledger against the **commit** — `sha + subject`, **no `author` field, ever**.
Glory is the commit's, so this never becomes a trophy hall for people.

---

## 7. The rulebook is append-only

If this is a game people trust over time, the rules a past catch was judged under must be **immutable**.

- **Allowed conventions** (date-orderings) and **allowed conversions** (the gear whitelist) live in a
  versioned, **append-only** rulebook.
- You may **append** a new convention or gear — that opens a new *season* with new claimable days.
- You may **never remove or alter** a past entry. A day caught under rulebook `vN` stays valid forever.

**Rulebook v1 (proposed):**

- Conventions: `mm-dd-yy`, `yy-m-dd`, `yyyy-mm-dd`; qualifying depth ≥ 5; the canonical π-instant
  (`09:26:53.589…`) for time-extended reads.
- Conversions (deep-time-safe arithmetic gears): `gregorian`, `julian`, `islamic` (tabular Hijri).
- Deferred to a later season (append when ready): `persian-33y` (cyclic 33-year arithmetic Persian —
  model-dependent, so its own season with the model pinned).

---

## 8. Reasonable beginning, reasonable end

- **Beginning:** it began with **single dates**. `GENESIS` anchors the axis at the historical era; additions
  push toward the future, deletions toward antiquity — the axis is symmetric around "now."
- **End:** the allowed conventions over the safe band make the set of perfect π-days **finite and
  enumerable**. A season **closes when its catalog is fully claimed** — every claimable day caught by some
  commit. Appending a convention (⋲ §7) opens the next finite season. Finite map, filled by merges, done
  when full — then grown, never rewritten.

---

## 9. Tunables (operator's free choice — `rewards.json` / `rulebook/`)

Everything the operator freely chooses, none of it touching the engine:

| Parameter | Meaning |
|---|---|
| `SAFE_MIN`, `SAFE_MAX` | the finite band (must stay `< 2^53`) |
| `GENESIS` | the axis anchor / "now" |
| `PITCH` | JDN span per helix turn |
| `MAX_TURNS` | clock cap (anti-slack) |
| `DIRECTION_RATIO` | the `0.1` in the BC/AD threshold |
| `QUALIFYING_DEPTH` | minimum π-depth for a catch (default 5) |
| `rulebook/` | append-only allowed conventions + gear whitelist |

---

## 10. What lands, and in what order

1. This spec, reviewed and parameters settled (**you are here**).
2. `rulebook/v1.*` (append-only) + `rewards.json` defaults.
3. A pure `reckon(merge)` function in the engine package — `(sha, additions, deletions, commits) →
   {window, catches[]}` — fully unit-testable off-CI, deterministic, guarded.
4. A fleet-ci job on push→`main` that calls `reckon`, appends catches to the ledger, and commits it back
   with `[skip ci]` (so the bot commit never re-triggers the game).

No CI or bot-commit code lands before steps 1–3 are green and you've signed off the parameters.
