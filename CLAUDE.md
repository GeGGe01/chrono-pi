# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

chrono-pi is a **deterministic calendar-collision search engine**: given exact calendar/date-pattern
rules, it finds every day on which a calendar reads out the digits of π (e.g. American `3/14/15` →
`31415`) and the rare "collision" days where two or more independent calendars read π at once — with
complete, reproducible, independently verifiable results.

## ⚠ Governing order: REBUILD in progress (read this first)

The project is being **rebuilt** per **`docs/REBUILD.md`** (the current source of truth for direction).
The rebuild is **not** a feature-preserving port of v1: it reduces the calendar surface, replaces the
brute-force scan with an explicit deterministic residue/CRT engine, and retargets Cloudflare Workers.

- **`docs/REBUILD.md` governs.** The old design package — `docs/00`–`07`, `docs/conventions.md`, and
  `docs/superpowers/specs/*` — is now **v1 reference, superseded**. It documents what v1 did (the
  scan-based engine, Phases 1–5); it is **not** the order to execute. Do not "execute the locked spec
  verbatim" — that was the v1 mode and no longer applies.
- **Forgejo (`git.gegge.me`) is the source of truth.** Work happens on the fork
  `DaBroodWDBrillz/chrono-pi`; land via PR to its `main` (operator's gate), one reviewable slice per PR.
- **Docs-first.** When the order changes, this file and `docs/REBUILD.md` are updated **before** code.

## Product contract (invariants — never violate)

- **Deterministic only. No LLM in the search path.** Same query + same model versions ⇒ same result set.
- **Completeness over the quotient.** Cover every witness *class* the rules define (CRT residue classes),
  and enumerate every requested concrete witness — never scan all `L` raw dates, never silently sample.
  An over-budget or cut-off search returns explicit incomplete/error status, never a partial-looking `0`.
- **Independent verification.** Every emitted witness is checkable by a verifier that shares no code with
  the search that found it (see `packages/engine/src/residue/verify.ts`).
- **Exact arithmetic.** Integer / BigInt for periods, absolute-day indices, CRT solutions, supercycles.
- **Explicit conventions.** A calendar's epoch/convention is part of its identity (e.g. tabular Hijri,
  cyclic-33 Persian — never silently the astronomical calendar).

## Architecture

pnpm + strict-TypeScript monorepo. The linear axis is the integer **JDN**; every calendar is a pure
function of it.

- **`packages/engine/src/residue/`** — the deterministic core (the rebuild's Workstream B). `compileGear`
  reduces one `(calendar, reckoning)` π-reading to its active residue set `A ⊆ Z/P` over one supercycle
  (Tågrälssatsen III); `witnessJdns` enumerates concrete witnesses **arithmetically** (`t = a + mP`) over
  any range — no raw-date scan; `verifyWitness` is the independent boundary. Two-system collisions via
  generalized CRT (gcd compatibility, `lcm` witness classes) are the next slice.
- **`packages/engine/src/{jdn,pi,clock,calendars,reckonings,scan,collisions}.ts`** — v1 engine.
  **`scan.ts` (brute-force window search) is retained as the regression ORACLE**, not the product path:
  the residue engine is property-tested to equal it on shared ranges. `collisions.ts` itself notes the
  CRT witness search was unbuilt in v1 — that is what the rebuild adds.
- **`packages/data`** — schema-validated reproducible JSON artifacts.
- **`apps/site`** — Astro static site (deterministic **search** UI per REBUILD §5; the "hall of fame"
  is superseded). **`apps/sync`** — Google Calendar push.

**Deep time:** Temporal-backed calendars fail past ~year 275760, so the deterministic engine and its
verifier must use **arithmetic** readers (`jdn.ts` and the arithmetic calendars) to reach the deep-future
witnesses. Witness *enumeration* is already deep-time-safe (pure arithmetic); an arithmetic Gregorian
reader for deep-time compile/verify is a near-term slice.

## Target deployment

**Cloudflare** (Workers + Queues + Durable Objects where live coordination is genuinely needed) —
Cloudflare *scales execution*; it never defines search semantics or what `complete` means. Served at
**`typ.gegge.org/chrono-pi`** (path-based: Astro `base: '/chrono-pi'` + CF routing must agree). Pages-first
for the static site; the deterministic API on Workers. Deployment is an adapter, not the source of truth.

## Current state

- v1 engine + data + site are present and green (155+ engine tests) and serve as the reference/oracle.
- Rebuild started on the deterministic residue engine: `gregorian/mm-dd-yy` gear (P=146097, 4 π-residues,
  merged) and `julian/mm-dd-yy` gear (P=36525, 1 residue). Arithmetic witnesses == v1 scan; verifier holds.
- Next: arithmetic Gregorian reader (deep time) → two-system CRT collision (Kalenderkrock; the gcd filter
  that turns a naive product count into the correct one — the "36 not 396" discipline).

## Working rules

- One logical change per commit; conventional commits (release automation reads them).
- PR-per-slice to Forgejo `main`; keep PRs reviewable (not one mega-PR).
- Reuse before rewrite — v1's proven conversions are the base; do not re-derive what already exists.
