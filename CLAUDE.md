# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

chrono-pi finds every day on which an attested calendar-and-format reads out the digits of π (e.g. American `3/14/15` → `31415`), tracks upcoming ones in Google Calendar, and chronicles rare "collision" days where two or three independent calendars read π at once.

**Current state: engine built (Phases 1–2 core).** `packages/engine` is a working pure engine — the JDN axis, the π matcher, calendar + reckoning registries, ~19 calendars (Temporal-backed and arithmetic), the standard reckonings, the perfect-day scanner, window collision detection, and a reference-table regression (`packages/engine/test/reference.test.ts`) that locks 102 rows from `docs/reference-table.md` against a variance ledger. `apps/site` and `apps/sync` are still empty placeholders. The pinned conventions, the recorded variances (mostly errors in the hand-built reference table), and the deferred calendars are documented in `docs/conventions.md`. The `.github/` automation/config (workflows, templates, `dependabot.yml`, release-please, and the `gh`-runbook JSON inputs) is in place.

## Implementation mode: `spec-first`

The design is locked and executed **verbatim**. This is the governing constraint and it changes how you work:

- Read `docs/04-agent-instructions.md` first — it is the operating manual for the implementation agent (init sequence, guardrails, error handling).
- The contracts and step list in `docs/03-short-horizon.md` are **fixed**. Execute the steps in order. If a contract cannot be honoured as written, **stop and escalate** (per `docs/07-agent-loop.md`) — do not silently redesign an interface.
- **One logical change per commit. Non-negotiable.** release-please reads each commit to build the changelog and detect version bumps; batched commits break it.
- **Narrate each step.** Start: `Step N — <what is about to happen>`. End: `Step N done — <what was produced>` plus the commit hash.

## Design package (read in this order)

| File | Use |
|------|-----|
| `docs/01-whitepaper.md` | What is being built; the core definitions (perfect pi-day, depth, provenance, tiers, collision) — these are the product, not implementation detail |
| `docs/03-short-horizon.md` | **Phase 1 contracts (TypeScript interfaces) and the verbatim 12-step build plan** |
| `docs/04-agent-instructions.md` | How the implementation agent runs the build |
| `docs/05-engineering-handbook.md` | Branch / commit / PR / release rules |
| `docs/06-ci-cd-plan.md` | CI workflows, deploy, rollback |
| `docs/07-agent-loop.md` | Reporting cadence and escalation rules |
| `docs/02-long-horizon.md` | The six-phase v1.0 roadmap |

Note: `docs/` holds the design package (`00`–`07`) plus `docs/IMPORT.md`, the one-time operator runbook that applies labels / branch protection / repo settings via `gh`. The GitHub automation and config live in `.github/`. (The design package was originally written against target folder names `chrono-pi-design/` and `bootstrap/`; those have been reconciled to the actual `docs/` and `.github/`.)

## Target architecture (Phase 1+)

A pnpm + strict-TypeScript monorepo. Components are independent and communicate through generated JSON with shared types:

- **`packages/engine`** — pure, no I/O. A calendar registry, a reckoning registry, the π-matcher, the perfect-day scanner, and the collision search.
- **`packages/data`** — generated artifacts (`perfect-days.json`, `collisions.json`) plus the shared TypeScript types the engine exports and everything else imports.
- **`apps/site`** — Astro static site consuming the JSON at build time (countdown island, hall of fame, timeline).
- **`apps/sync`** — Google Calendar push; idempotent upsert keyed by a stable `iCalUID`.

**The linear axis is the Julian Day Number (integer); ISO dates index it.** Every calendar is a pure function `fields(jdn)`, which is what makes a collision a group-by over independent calendars (Bézout / CRT over coprime periods).

Calendars `Temporal` + ICU support (Gregorian, Julian, Hebrew, Persian, Indian, tabular Islamic, Chinese, Japanese, Coptic, Ethiopic) are read through `Temporal` with an **explicit** calendar identifier (e.g. `islamic-tbla` — the tabular variant, never the astronomical one). Calendars ICU lacks (Holocene, Unix time, MJD, novelty systems) are hand-implemented arithmetic over the JDN. Adding a calendar or reckoning is one file plus one regression test; the engine core does not change.

## Correctness model (most important risk)

Convention drift is the central correctness risk — tabular calendar variants can differ by a day, and ICU's conventions may not match the project's reference table.

- **The reference table is the oracle.** A produced date that disagrees with it is a **finding to record** (date, calendar, both values) as a convention variance — never a number to quietly accept, and never edit the table to match the code.
- Pin exactly one convention per calendar via explicit IDs; never let a calendar default to an unspecified variant.
- Regression tests against the reference table are the acceptance gate (Phase 2).

## Commands

Node version is pinned in `.nvmrc` (22); pnpm is the package manager. These match the CI pipeline in `ci.yml` (lint → typecheck → test → build, stop on first failure):

```bash
pnpm install --frozen-lockfile   # CI install
pnpm -r lint                     # ESLint flat config (eslint.config.js)
pnpm -r typecheck                # tsc --noEmit across the workspace
pnpm -r test                     # Vitest across the workspace
pnpm -r test -- --coverage       # with coverage (CI)
pnpm -r build                    # build all, including the Astro site

pnpm --filter chrono-pi-engine scan 2026-01-01 2126-01-01   # run the engine over a range
pnpm --filter site build                                    # build just the site
```

To run a single test once packages exist, use Vitest directly in the package, e.g. `pnpm --filter chrono-pi-engine exec vitest run test/smoke.test.ts`.

## Conventions

- **Conventional Commits**, validated by commitlint (`commitlint.config.cjs`): `<type>(<scope>): <subject>`, imperative, ≤ 72 chars. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`.
- All committed text — code, comments, commit messages, docs — is in **English**.
- Code comments state intention, not implementation, in at most one and a half sentences.
- Trunk-based: no direct push to `main`; feature branches `<type>/<scope>-<description>` (e.g. `feat/engine-scan`) merge via PR. **Rebase merge only** (squash would collapse the granular commits release-please needs).
- Prettier: semicolons, single quotes, trailing commas (`all`), width 100 (`.prettierrc`).

## Do not

- Push to `main` directly, deploy, create/edit Google OAuth credentials, or commit secrets (OAuth creds live as run-environment secrets only).
- Redesign a fixed contract from `docs/03-short-horizon.md` without escalating.
- Read a file before overwriting it — always read first.
