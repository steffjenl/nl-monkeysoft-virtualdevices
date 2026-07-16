# MonkeySoft Virtual Devices

A Homey app that provides virtual devices for use in Flows. Virtual devices hold a value (boolean, number or text) without any physical hardware behind them, so you can use them as state holders, dummy sensors and Flow building blocks.

Built from scratch on the Homey Apps SDK v3 with TypeScript. Not affiliated with, and no code shared with, any existing "virtual devices" style app.

## Supported virtual devices

| Driver              | Capability                | Description                                            |
| ------------------- | ------------------------- | ------------------------------------------------------ |
| Virtual Switch      | `onoff`                   | A boolean true/false value                             |
| Virtual Button      | `onoff`                   | A toggle button with on/off/toggled triggers           |
| Virtual Number      | `virtual_number` (custom) | A numeric value with optional unit, decimals and range |
| Virtual Text        | `virtual_text` (custom)   | A text value with equals/contains conditions           |
| Virtual Temperature | `measure_temperature`     | A temperature value in °C                              |
| Virtual Power       | `measure_power`           | A power value in watts                                 |
| Virtual Battery     | `measure_battery`         | A battery level in %, clamped to 0–100                 |

Every driver provides Flow cards:

- **Triggers** — value changed (with `value` and `previous` tokens); the button additionally has turned on / turned off / toggled.
- **Conditions** — is true / is turned on (booleans), is between minimum and maximum (numeric), is equal to / contains (text).
- **Actions** — set the value (and turn on / turn off / toggle for the button).

Standard capabilities (`onoff`, `measure_*`) also expose Homey's built-in Flow cards for free.

## Requirements

- Node.js 18+ (developed on Node 22)
- [Homey CLI](https://apps.developer.homey.app/the-basics/getting-started): `npm install -g homey`
- A Homey (Pro or Cloud) for running the app; the app supports both platforms

## Installation (local development)

```bash
npm install
npm run build        # compile TypeScript
homey app run        # run on your Homey (Ctrl+C to stop)
homey app install    # install permanently on your Homey
```

`homey app run`/`install` compose `app.json` from `.homeycompose/` and the per-driver `driver.compose.json` files automatically, and compile the TypeScript. The root `app.json` is **generated** — never edit it by hand; edit the compose sources instead.

## Commands

| Command                                 | What it does                                         |
| --------------------------------------- | ---------------------------------------------------- |
| `npm run build`                         | Compile TypeScript to `.homeybuild/`                 |
| `npm run typecheck`                     | Type-check without emitting                          |
| `npm run lint`                          | ESLint + Prettier check                              |
| `npm run lint:fix`                      | Auto-fix lint/format issues                          |
| `npm test`                              | Vitest unit tests (validators + compose consistency) |
| `npm run validate`                      | `homey app validate --level publish`                 |
| `node scripts/generate-placeholders.js` | Regenerate placeholder PNGs                          |

## Adding a new virtual driver

The architecture is designed so a new type (humidity, pressure, contact, dimmer, …) is mostly configuration. See [docs/architecture.md](docs/architecture.md) for details. In short:

1. Create `drivers/virtual-<type>/` with `driver.compose.json` (name in 10 languages, class, capability), `driver.flow.compose.json` (trigger/condition/action cards) and assets.
2. Add a custom capability in `.homeycompose/capabilities/` if no standard Homey capability fits.
3. Write `driver.ts` extending `BaseVirtualDriver` with a `flowConfig` object (~10 lines).
4. Write `device.ts` extending `BaseVirtualDevice` with a `config` object (~10 lines); override `normalizeValue()` only if the type needs extra constraints.
5. Run `npm test && npm run validate` — the compose consistency test enforces complete translations and `titleFormatted` coverage automatically.

## Privacy & security

- All values live locally on your Homey. Nothing leaves the device.
- No external API calls, no telemetry, no tracking.
- The app requests **no** Homey permissions (`"permissions": []`).

## Documentation

- [docs/architecture.md](docs/architecture.md) — how the code is organized
- [docs/development.md](docs/development.md) — development workflow
- [docs/testing.md](docs/testing.md) — test strategy
- [specs/](specs/) — requirements, flow cards, localization, release checklist
- [adr/](adr/) — architecture decision records

## Release checklist (Homey App Store)

See [specs/release-checklist.md](specs/release-checklist.md). Highlights:

1. Replace the generated placeholder images (`assets/images/*`, `drivers/*/assets/images/*`) with real branding.
2. Review/complete App Store metadata (screenshots, support URL, source URL).
3. `npm run lint && npm test && npm run validate` must all pass.
4. Bump the version in `.homeycompose/app.json`, update `CHANGELOG.md` and `.homeychangelog.json`.
5. `homey app publish`.
