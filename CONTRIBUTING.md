# Contributing to chrono-pi

This project is primarily developed by the maintainer. External contributions are not actively sought, but issues and PRs are read.

## Issues

Open an issue for a bug or an idea. For a wrong date, include the calendar, the format, the expected reading, and the convention you are comparing against.

## PRs

- Large changes: open an issue first for discussion.
- Small fixes: a direct PR is fine.
- Run the checks locally before opening: `pnpm -r lint && pnpm -r typecheck && pnpm -r test`.
- Use a Conventional Commits title (`feat:`, `fix:`, `docs:`, …).

## Adding a calendar or a reckoning

A new calendar is a `Calendar` implementation; a new reckoning is a `Reckoning` implementation. Each must ship with a regression test against a known date. The engine core is not modified.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
