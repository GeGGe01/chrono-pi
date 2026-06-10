# chrono-pi

> Finds every day on which an attested calendar-and-format reads out the digits of π, tracks the upcoming ones in Google Calendar, and chronicles the rare days where two or three independent calendars read π at once.

## Status

<!-- Badges: CI, license, version -->
![CI](https://github.com/GeGGe01/chrono-pi/actions/workflows/ci.yml/badge.svg)

Site: https://pi.gegge.se

## Features

- A deterministic engine that scans a date range and finds perfect pi-days across many calendars and date formats.
- A readability-based definition: a day qualifies when its rendered digits form a prefix of π, to a measured depth.
- Detection of double and triple pi-days — days where independent calendars read π at once.
- A static countdown site to the next perfect pi-day, with the upcoming queue and a collision hall of fame.
- A Google Calendar integration that populates a dedicated calendar over a lifetime window.

## Getting started

```bash
# Install
pnpm install

# Run the engine over a range
pnpm --filter chrono-pi-engine scan 2026-01-01 2126-01-01

# Build the site
pnpm --filter site build
```

## Documentation

See [`docs/`](docs/) for the full design package — start with [`01-whitepaper.md`](docs/01-whitepaper.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Acknowledgements

The pi-day taxonomy across calendars, the reckoning model, and the reference tables originate from posts by The Crash on Flashback.

## License

Source code: MIT — see [LICENSE](LICENSE).
Documentation: CC BY 4.0 — see [LICENSE-docs](LICENSE-docs).

Documentation covers `README.md`, `docs/`, and other top-level `.md` files. `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md` have their own licenses (Contributor Covenant is CC BY 4.0).
