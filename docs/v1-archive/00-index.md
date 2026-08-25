# chrono-pi — Design index

chrono-pi finds every day on which an attested calendar-and-format reads out the digits of π, tracks the upcoming ones in Google Calendar, and chronicles the rare days where two or three independent calendars read π at once.

> ⚠ **SUPERSEDED — v1 reference only.** The project is being rebuilt. The current governing order is
> **`docs/REBUILD.md`** (deterministic residue/CRT engine, reduced calendar surface, Cloudflare Workers
> target). This design package (`00`–`07`, `conventions.md`, `superpowers/specs/*`) documents what v1 did
> (the scan-based engine); it is **not** the order to execute. The "locked, executed verbatim" mode below
> was v1 and no longer applies.

## Status

- **v1:** built (scan-based engine, Phases 1–5) — now the reference / regression oracle for the rebuild.
- **Implementation mode:** rebuild per `docs/REBUILD.md` (docs-first, PR-per-slice to Forgejo `main`). The former `spec-first` locked-verbatim mode applied to v1 only.
- **License:** MIT.
- **Working repo name:** `chrono-pi`.

## Documents

| File | Purpose | State |
|------|---------|-------|
| `00-index.md` | This overview and reading order | — |
| `01-whitepaper.md` | What the product is, the core definitions, architecture, design choices | Locked |
| `02-long-horizon.md` | The coarse plan for v1.0 — phases, goals, milestones | Locked |
| `03-short-horizon.md` | The detailed, pre-approved step plan for the nearest phase | Locked |
| `04-agent-instructions.md` | How the implementation agent runs the build | Locked |
| `05-engineering-handbook.md` | Branch, commit, PR, release, maintenance rules | Phase B |
| `06-ci-cd-plan.md` | Workflows, deploy, rollback, observability | Phase B |
| `07-agent-loop.md` | Loop cadence, reporting, escalation, termination | Phase B |
| `.github/` | Repo automation and config (workflows, templates, settings) | Imported |

## Reading order

For a person: `01` for what and why, `02` for the shape of the build, `03` for the next concrete steps.

For the implementation agent: follow the init sequence in `04-agent-instructions.md`.

## Next step

Phase A is complete. Create the repository, then return with written confirmation that it exists. That confirmation, together with the Phase A → Phase B confidentiality checklist (repo namespace, visibility, and which identifiers may appear in committed files), starts Phase B and the generation of `05`–`07` plus the `.github/` config.
