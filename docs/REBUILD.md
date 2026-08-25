# chrono-pi — Rebuild brief (governing order)

This is the current source of truth for **direction**. It supersedes the v1 design package
(`docs/00`–`07`, `docs/conventions.md`, `docs/superpowers/specs/*`), which now stands as v1 reference
only. When direction changes, update **this file and `CLAUDE.md` before code** (docs-first).

## Objective

Rebuild chrono-pi as a smaller, cleaner, **deterministic** calendar-collision search engine. A user
enters an exact calendar/date-pattern query, optionally bounded by two dates, runs it (or a safe random
"surprise me"), and gets **complete, reproducible, independently verifiable** results plus a view of how
the engine reduced the search space. Not a feature-preserving port: reduce the calendar surface, make the
math explicit in code.

> **Never skip the search space. Never solve the same future twice.**

## Non-goals (never add to the core)

LLM parsing / probabilistic search / heuristic completeness / "best-effort presented as complete" /
hidden sampling / autonomous agents / raw-date brute force when a residue representation exists / a
public claim that "Finite-State Scheduling Theory" is established / a redesign of the design system.

## Product contract

- **Determinism** — same query + same model versions ⇒ same result set (concurrency changes order/latency, not results).
- **Completeness over the quotient** — cover every witness class the rules define; enumerate every requested concrete witness; reject or terminate-as-incomplete rather than return a partial-looking result.
- **Verifiability** — every witness independently checkable by a verifier that does not depend on the search algorithm.
- **Exact arithmetic** — integer / BigInt for periods, day indices, CRT, supercycles.
- **Explicit conventions** — epoch/convention is part of the query/model identity.

## Mathematical core (the reduction)

Compile each calendar+rule to `(period Pᵢ, active residue set Aᵢ ⊆ Z/Pᵢ)`. For a set of systems `J`:
`L_J = lcm(Pᵢ)`; coherent residue tuples (pairwise `aᵢ ≡ aⱼ mod gcd(Pᵢ,Pⱼ)`) map **bijectively** to
witness classes `t ≡ t₀ (mod L_J)` via generalized CRT (Tågrälssatsen III). Enumerate only integers `m`
with `start ≤ t₀ + mL ≤ end`, then verify each concrete witness. Keep `L` (supercycle), `N` (classes per
cycle), `L/N` (mean interval — **not** a period) distinct.

**Discipline (the "36 not 396" lesson):** never use the product `∏|Aᵢ|` without the gcd compatibility
filter. gcd says which markings can meet; the actual residue distribution says how many survive.

## Named results (article-backed; see the uploaded handover + prior-art sheet for citations)

Kalenderkrockssatsen (two-system existence/count) · Tågrälssatsen I (peak lockout `M ≥ ⌈Σdᵢ/Pᵢ⌉`,
capacity `K ≥ X+M`) · II (simultaneity, the ∃-tuple-∀-pairs quantifier) · III (witness space `|W_J|=|C_J|`)
· Tibiasatsen / The Flashback Theorem (dynamic finite-state: self-sustaining at rate X ⟺ a reachable
full-rate cycle). **Tibia/endogenous-state machinery is Phase-4 / Del-III territory — do NOT force it into
the static calendar engine, which already has its residue quotient.** "Finite-State Scheduling Theory" is
a reserved internal candidate, not published theory.

## Architecture & platform

Dependency direction: calendar models → rule compiler → math/witness core → search service →
orchestration/API → UI. Verifier independently callable. **Cloudflare** (Workers + Queues + Durable
Objects only where live coordination is genuinely needed) *scales execution, never defines search
semantics*. Queue delivery is at-least-once → every work unit idempotent with a canonical id. Deploy at
`typ.gegge.org/chrono-pi`. **Forgejo is the source of truth; deployment is an adapter.**

## Workstreams (decomposable; Operations owns sequencing)

A repo/baseline · **B math/search core** · C calendar models (one adapter at a time) · **D independent
verification / adversarial test** · E Cloudflare runtime · F frontend/search UX · G article content
(`/content/sv`,`/content/en`) · H Del-III audit (last, from finished code — falsify the abstraction, don't
decorate). Freeze points: calendar-model, compiled-rule, witness-class, work-unit, semantic-search-key,
public SearchResult contracts.

## Phase order

0 preserve (baseline tag exists: `chrono-pi-v1.0.0`) → 1 math core (residue/CRT + verifier + property
tests vs brute-force oracle) → 2 search product (search box, chips, ranges, share URLs, completeness
status) → 3 resource safety (preflight cost, bounded concurrency, safe random) → 4 orchestration/dynamic
state *only where needed* → 5 content → 6 Del-III audit.

## MVP acceptance (abridged)

Small calendar set works · real deterministic search box · exact date-range · safe "surprise me" ·
independently verified results · completeness stated · no silent sampling · concurrency-invariant ·
optimized search matches brute force on small property tests · design system preserved · sv/en articles ·
canonical shareable searches · **no LLM in the search path**.

## Current progress

Deterministic residue engine (`packages/engine/src/residue/`): `gregorian/mm-dd-yy` gear (P=146097, 4
π-residues) merged; `julian/mm-dd-yy` gear (P=36525, 1 residue). Arithmetic witnesses == v1 `scan` oracle;
independent verifier holds. Next: arithmetic Gregorian reader (deep time) → two-system CRT collision.
