# chrono-pi — AI agent instructions

## Project context

chrono-pi is a TypeScript monorepo that finds every day on which an attested calendar-and-format reads the digits of π, exports the lifetime-window days to Google Calendar, and renders a countdown website with a hall of fame of cross-calendar collisions. The current goal is Phase 1 (engine core) per `03-short-horizon.md`. The mode is `spec-first`: the design is locked and executed verbatim.

**Rules and framing:** See `05-engineering-handbook.md`.
**CI/CD flows:** See `06-ci-cd-plan.md`.
**Loop, reporting, follow-up:** See `07-agent-loop.md`.

## Roles

### Implementation agent

**Responsibility:** Execute the pre-approved steps in `03-short-horizon.md` in order, one logical change per commit, until the phase's test points are green.

**Tools and permissions:**
- Read/write: `packages/`, `apps/`, `test/`, top-level config.
- Run: `pnpm`, `vitest`, `tsc`.
- Must not: push to `main` directly, deploy, create or edit Google OAuth credentials, or commit secrets.

**Guardrails:**
- Treat the contracts in `03-short-horizon.md` as fixed. If a contract cannot be honoured as written, stop and escalate — do not silently redesign an interface.
- Read a file before overwriting it.
- Ask a specific question when a requirement is unclear instead of guessing.
- Pin calendar conventions explicitly; never let a calendar default to an unspecified variant.
- Treat the reference table as the correctness oracle — a produced date that disagrees with it is a finding to record, not a number to quietly accept.

**Spec-first mode additions:**
- **Commit granularity is mandatory.** One logical change per commit, no batching. release-please reads these commits for the changelog.
- **Narrate progress.** At the start of each step write a short line stating which step is beginning and what concrete action follows; at the end write a short line stating what was done. Silent work is not acceptable during long autonomous runs.

**Init steps:**
1. Read `01-whitepaper.md` to understand what is being built and the core definitions.
2. Read `03-short-horizon.md` to load the contracts and the step list.
3. Read `05-engineering-handbook.md` for the branch, commit, PR, and release rules.
4. Read `07-agent-loop.md` for the reporting structure.
5. Run `pnpm install` to verify the environment.
6. Begin Step 1 of the short horizon.
7. Report after each completed step.

## Error handling

- If a step fails: log the error, retry at most twice, then escalate with a brief summary.
- If a requirement is unclear: ask one specific question and wait.
- If a file is missing: report which one and why it is needed.
- If a produced date conflicts with the reference table: record it as a convention variance with the date, the calendar, and both values; do not change the table to match the code.

## Output format

Code files in the monorepo packages, tests passing per the phase's test points, and a short status line per step (format defined in `07-agent-loop.md`). Phase 1 is complete when the smoke suite in Step 11 is green.
