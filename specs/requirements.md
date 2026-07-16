# Requirements

## Goal

Provide virtual devices on Homey that hold a value without physical hardware, for use as state holders and Flow building blocks. Modern, maintainable replacement for older "virtual drivers" style apps, implemented from scratch (no code, assets or texts reused).

## Functional requirements

| #   | Requirement                                                                                                                                  | Status                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| F1  | Virtual Switch (boolean): changed trigger, is-true condition, set action                                                                     | ✅                          |
| F2  | Virtual Button: turned on / turned off / toggled triggers, is-on condition, turn on / turn off / toggle actions                              | ✅                          |
| F3  | Virtual Number: changed trigger, in-range condition, set action; settings for min/max/decimals/unit                                          | ✅                          |
| F4  | Virtual Text: changed trigger, equals + contains conditions, set action                                                                      | ✅                          |
| F5  | Virtual Temperature on `measure_temperature`: changed trigger, in-range condition, set action                                                | ✅                          |
| F6  | Virtual Power on `measure_power`: changed trigger, in-range condition, set action                                                            | ✅                          |
| F7  | Virtual Battery on `measure_battery`: changed trigger, in-range condition, set action, clamped 0–100                                         | ✅                          |
| F8  | Devices addable via pairing without hardware                                                                                                 | ✅                          |
| F12 | Virtual Humidity, Luminance, Pressure and CO2 on standard `measure_*` capabilities: changed trigger, in-range condition, set action          | ✅ (v1.1.0)                 |
| F13 | Virtual Contact (`alarm_contact`) and Motion (`alarm_motion`): opened/closed resp. started/ended triggers, invertible condition, set actions | ✅ (v1.1.0)                 |
| F14 | Virtual Dimmer (`onoff` + `dim`): percentage-based changed trigger, in-range condition, set action; onoff synced                             | ✅ (v1.1.0)                 |
| F15 | Virtual Energy Meter (`meter_power`): changed trigger, in-range condition, set + add actions                                                 | ✅ (v1.1.0)                 |
| F16 | User can choose a device name and icon (27 built-in icons) during pairing                                                                    | ✅ (v1.1.0)                 |
| F9  | Values persist across app/Homey restarts                                                                                                     | ✅ (Homey capability store) |
| F10 | Capability changes from the Homey UI update state and fire triggers                                                                          | ✅ (capability listener)    |
| F11 | Flow triggers carry `value` and `previous` tokens                                                                                            | ✅                          |

## Non-functional requirements

| #   | Requirement                                                    | Status                        |
| --- | -------------------------------------------------------------- | ----------------------------- |
| N1  | Homey Apps SDK v3, platforms local + cloud                     | ✅                            |
| N2  | TypeScript, strict mode, compiles without errors               | ✅                            |
| N3  | Translations: en, nl, de, fr, es, it, da, sv, no, pl           | ✅                            |
| N4  | No external API calls, telemetry or tracking; zero permissions | ✅                            |
| N5  | Shared architecture, no copy-paste between drivers             | ✅ (lib/)                     |
| N6  | Input validation: no NaN/null/undefined leaks; safe defaults   | ✅ (lib/validators.ts)        |
| N7  | Lint, build and test scripts work                              | ✅                            |
| N8  | Extensible to new virtual types with minimal code              | ✅ (see docs/architecture.md) |

## Validation rules

- Numeric input from flow args is parsed with `parseNumber` (accepts numbers and numeric strings, rejects NaN/Infinity/empty/other types → localized error).
- Range checks are inclusive (`min <= value <= max`); swapped bounds are treated as the equivalent valid range; invalid inputs make the condition return false rather than throw.
- Battery values are clamped to 0–100. Number values are clamped to the configured range only when the "limit range" setting is enabled, and always rounded to the configured decimals.
- Text comparisons are case-insensitive by default; a per-device setting enables case sensitivity.

## Safe defaults

| Device           | Default value                                |
| ---------------- | -------------------------------------------- |
| Switch / Button  | `false`                                      |
| Number / Power   | `0`                                          |
| Text             | `""` (empty)                                 |
| Temperature      | `20` °C (benign ambient value)               |
| Battery          | `100` % (avoids spurious low-battery alerts) |
| Humidity         | `50` % (benign ambient value)                |
| Luminance        | `0` lx                                       |
| Pressure         | `1013` mbar (standard atmosphere)            |
| CO2              | `400` ppm (outdoor baseline)                 |
| Contact / Motion | `false` (closed / no motion — avoids alarms) |
| Dimmer           | `0` % (off)                                  |
| Energy meter     | `0` kWh                                      |

## Out of scope (future work)

Generic sensor type with free capability choice; initial-value input during pairing; changing a device icon after pairing (Homey platform limitation — remove and re-add instead); Fahrenheit display (Homey converts `measure_temperature` automatically).
