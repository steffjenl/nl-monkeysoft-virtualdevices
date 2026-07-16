# ADR-0002: Virtual device architecture

Date: 2026-07-15 · Status: accepted

## Decision

### One shared value path

All device logic lives in `lib/BaseVirtualDevice`. Both input routes — the capability listener (Homey UI / API / built-in cards) and `setValue()` (this app's flow actions) — go through `normalizeValue()` (validate + constrain, throws localized errors) and `writeValue()` (persist + fire triggers only on actual change, with `value`/`previous` tokens). Subclasses override `normalizeValue()` for constraints (number: round + optional clamp; battery: clamp 0–100) and `onValueChanged()` for extra triggers (button).

### Declarative flow registration

Drivers declare a `flowConfig` object naming their card ids; `lib/flow.ts` registers the matching run listeners (in-range, is-true, equals, contains, set, turn on/off, toggle). Adding a driver requires no new listener code.

### Capabilities

Standard Homey capabilities wherever they exist (`onoff`, `measure_temperature`, `measure_power`, `measure_battery` + `energy.batteries: ["OTHER"]`) so users get built-in cards, Insights and Energy integration for free. Custom capabilities (`virtual_number`, `virtual_text`) only where no standard fits.

### Persistence

Homey persists capability values natively across restarts. We rely on that instead of a parallel store; `onInit()` only applies the safe default when no valid value exists yet (first init after pairing). This avoids two sources of truth.

### Pairing

Simplest possible: `onPairListDevices()` returns one fresh device (driver name in the user's language, `randomUUID()` id) per session. No custom pair views; renaming and initial values are handled in the regular Homey UI. Revisit if users ask for bulk-add or initial-value input.

### Validation semantics

- Out-of-type input (non-finite numbers, wrong types) → reject with localized error.
- Out-of-range input where a range applies (battery, number with range enabled) → **clamp** rather than reject: flows keep working with sensor-style sources that occasionally overshoot; documented in specs/flows.md.
- Conditions never throw on bad input; they return false.

## Consequences

- A new virtual type is a compose folder plus ~25 lines of TS (see docs/architecture.md).
- The button's built-in `onoff` cards coexist with the custom turned on/off/toggled cards; both fire exactly once per change because the listener path and setValue path never overlap.
- Rounding differences on capability-listener input (e.g. API writes with excess decimals on a number device) are tolerated: the raw value is stored by Homey after the listener; our flow actions always store the normalized value.
