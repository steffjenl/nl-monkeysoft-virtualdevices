# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
