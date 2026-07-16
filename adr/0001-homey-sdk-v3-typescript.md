# ADR-0001: Homey SDK v3, TypeScript and Homey Compose

Date: 2026-07-15 · Status: accepted

## Context

We are building a new virtual-devices app from scratch. The legacy "Virtual Drivers" app is unmaintained and we reuse nothing from it. We need a stack that matches current Athom/Homey recommendations and stays maintainable for years.

## Decision

- **Homey Apps SDK v3** (`"sdk": 3`), `compatibility: ">=5.0.0"`, `platforms: ["local", "cloud"]` — virtual devices have no hardware dependencies, so supporting both Homey Pro and Homey Cloud is free.
- **TypeScript** in strict mode, with the official type definitions (`homey-apps-sdk-v3-types` aliased as `@types/homey`). The Homey CLI compiles TypeScript transparently during `run`/`install`/`validate` (output in `.homeybuild/`).
- **Homey Compose**: manifest sources in `.homeycompose/` and per-driver `driver.compose.json` / `driver.flow.compose.json` / `driver.settings.compose.json`. The root `app.json` is generated and must not be edited by hand.
- **App id `nl.monkeysoft.virtualdevices`** — reverse-DNS on the monkeysoft.nl domain. Deliberately "virtualdevices", not "virtualdriver(s)": it describes what users get and avoids confusion with the legacy app. The repository directory (`nl-monkeysoft-virtualdriver`) predates this decision; the app id is leading.
- **Tooling**: ESLint (flat config, typescript-eslint) + Prettier, Vitest for unit tests, npm scripts `build` / `lint` / `test` / `validate`.

## Consequences

- Publishing to the App Store requires validation at `--level publish`, which is wired into `npm run validate` and passes.
- Strict TS + generated manifest means schema errors surface at build/validate time rather than on users' devices.
- Contributors need the Homey CLI (`npm i -g homey`) for run/validate; plain `npm run build && npm test` works without it.
