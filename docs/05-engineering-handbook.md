# chrono-pi — Engineering Handbook

## Implementation mode

**Chosen mode:** `spec-first`

**Motivation:** The operator wants the v1.0 design fully documented up front and built in a single autonomous pass. `spec-first` locks the design at the end of Phase A, executes a pre-approved step list verbatim, and keeps the commit history granular enough for release-please to produce an accurate changelog. The mode is referenced explicitly in Commit conventions, PR process, and Release process below because it changes the rules there.

## License

**Chosen license:** MIT

**Motivation:** A permissive license fits a public, playful project with no patent or copyleft concerns; it imposes the least friction on anyone who wants to reuse a calendar conversion or the reckoning model.

LICENSE file: see `LICENSE` at the repo root.

## Documentation license

**Chosen license:** CC-BY 4.0

**Motivation:** Creative Commons licenses are written for prose; pairing the permissive MIT (code) with the permissive CC-BY (text) keeps the legal framing clean.

**Scope:** Covers `README.md`, `docs/`, and other top-level `.md` files. Does not cover `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, or inline source-code comments.

LICENSE-docs file: see `LICENSE-docs` at the repo root.

## Repo structure

```
chrono-pi/
├── packages/
│   ├── engine/        Pure engine: calendars, reckonings, π-matcher, scan, collisions
│   └── data/          Generated JSON artifacts + shared types
├── apps/
│   ├── site/          Astro static site (countdown, hall of fame, timeline)
│   └── sync/          Google Calendar push (idempotent upsert)
├── docs/              Design package (00–07)
├── .github/           CI, templates, settings
├── pnpm-workspace.yaml
└── package.json
```

## Branch strategy

**Model:** Trunk-based.

**Rules:**
- `main` is always deployable.
- Feature branches are named `<type>/<scope>-<description>`, e.g. `feat/engine-scan`.
- Branches merge via PR; no direct push to `main`.

## Commit conventions

**Standard:** Conventional Commits (`<type>(<scope>): <subject>`).

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`.

**Rules:**
- Subject describes the effect, not the implementation, in imperative form, ≤ 72 characters.
- Body explains *why* when it is not obvious; the *what* is in the diff.
- Breaking changes marked with `!` or a `BREAKING CHANGE:` footer.
- **One logical change per commit. Non-negotiable in `spec-first` mode** — release-please reads each commit to build the changelog and detect version bumps; batched commits produce empty entries and missed bumps.
- Code comments state intention, not implementation, in at most one and a half sentences.
- All committed text — code, comments, documentation, commit messages — is in English.

Validation: `commitlint` (config: `commitlint.config.cjs` at the repo root).

## PR process

**PR size:** Preferably < 400 lines of diff; larger PRs split or motivated in the description.

**PR description contains:** what changed, why (link the issue), how it was tested, any config or migration changes.

**Requirements for merge:**
- CI green (the `ci` workflow in `06-ci-cd-plan.md`).
- Required reviewer count: `0` (solo) — the agent self-reviews against the PR checklist and the operator self-reviews before merge.
- No unresolved conversations.
- Conventional Commits-formatted title.

**Merge strategy:** Rebase. Spec-first relies on granular commits reaching `main` individually; squash would collapse them and break release-please's changelog. `repo-settings.json` allows rebase only.

**Auto-merge:** Enabled — a PR with green CI and no open conversations may auto-merge, since there is no required reviewer at `solo`.

## Code review routine

Solo: the implementation agent runs a pre-review against the PR checklist (tests, docs, conventional title, CI). The operator self-reviews before merge. No CODEOWNERS at this level.

## Documentation review

Docs-only PRs (`docs:` type, no source changes) skip the build/test gate beyond markdown sanity and are fast-tracked. The operator owns `README.md` and `docs/`.

## Release process

**Versioning:** SemVer (MAJOR.MINOR.PATCH), starting in the `0.x` line until v1.0.

**Release tooling:** release-please (config: `.github/release-please-config.json`, manifest: `.github/release-please-manifest.json`).

**Release cadence:** Continuous — release-please maintains a release PR on `main` and cuts a version when it is merged.

**Release steps:**
1. Conventional commits land on `main` via rebase-merged PRs.
2. release-please opens or updates a release PR with the changelog and version bump.
3. Merging the release PR tags the version and creates a GitHub Release.
4. Site deploy follows per `06-ci-cd-plan.md`.

## Maintenance

- **Dependency updates:** Dependabot (config: `.github/dependabot.yml`), weekly for npm and GitHub Actions.
- **Security patching:** critical within 7 days, high within 30 days.
- **Deprecation:** a reckoning or calendar marked deprecated stays one minor version with a console warning before removal.
- **EOL policy:** only the latest minor is supported pre-1.0.
