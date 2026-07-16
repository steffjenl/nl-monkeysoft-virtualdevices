# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.1] - 2026-07-16

### Fixed

- Icon picker: the selected icon is now clearly highlighted (blue border, background and checkmark badge) and unselected icons are dimmed.
- Icon picker: the grid scrolls (fixed max height) so all 27 icons are reachable; a hint below the grid explains this.
- Icon picker: the driver's default icon is listed first; click handlers are wired before translations so the view can never end up non-interactive.
- Documented that device icons cannot be changed by an app after pairing (Homey platform limitation) and that the Homey mobile app (v6.8.0+) can change device icons via the device settings.

## [1.1.0] - 2026-07-16

### Added

- Eight new virtual devices: Humidity (`measure_humidity`), Luminance (`measure_luminance`), Pressure (`measure_pressure`), CO2 (`measure_co2`), Contact (`alarm_contact`), Motion (`alarm_motion`), Dimmer (`onoff` + `dim`) and Energy Meter (`meter_power`, with set and add actions), each with changed/opened/closed-style triggers, conditions and set actions in 10 languages.
- Icon picker during pairing: every device can be given one of 27 built-in icons (including trash bin, waste container and wheelie bin/kliko) and a custom name in a new custom pairing view. Icons are managed centrally in `assets/device-icons/` and synced per driver via `npm run sync:pairing`.
- Generic `clampMin`/`clampMax` constraints in the shared device config (battery, humidity 0–100; luminance, pressure, CO2, energy ≥ 0; dim 0–1).
- Generic "add to value" flow action support (used by the energy meter).

### Changed

- The Danish name of the Virtual Switch is now "Virtuel afbryder" to avoid a clash with the new Virtual Contact ("Virtuel kontaktsensor").
- The button's turned on/off/toggled triggers are now driven by shared config instead of a device-class override.

## [1.0.0] - 2026-07-15

### Added

- Initial release, built on Homey Apps SDK v3 with TypeScript.
- Virtual Switch (boolean) with changed trigger, is-true condition and set action.
- Virtual Button with turned on / turned off / toggled triggers, is-on condition and turn on / turn off / toggle actions.
- Virtual Number (custom `virtual_number` capability) with changed trigger, in-range condition, set action and settings for decimals, unit and an optional min/max range.
- Virtual Text (custom `virtual_text` capability) with changed trigger, equals/contains conditions (optional case sensitivity via device setting) and set action.
- Virtual Temperature (`measure_temperature`), Virtual Power (`measure_power`) and Virtual Battery (`measure_battery`) with changed triggers, in-range conditions and set actions.
- Translations for en, nl, de, fr, es, it, da, sv, no and pl.
- Value persistence across app/Homey restarts via Homey's capability store.
