# Testing

## Unit tests (Vitest)

```bash
npm test           # single run
npm run test:watch # watch mode
```

Two suites:

- `test/validators.test.ts` — pure helpers in `lib/validators.ts`: number parsing, rounding, clamping, inclusive range checks (including swapped bounds and NaN/null/undefined input), text equality/containment with case sensitivity, boolean parsing of dropdown values.
- `test/flow-compose.test.ts` — consistency of every `driver.flow.compose.json`: all 10 languages present on every title/arg/token, `titleFormatted` present and referencing every arg, and `value`/`previous` tokens on every changed/toggled trigger.

Device/driver classes are deliberately thin wrappers around the tested helpers; they depend on the Homey runtime and are covered by manual testing instead of mocking the SDK.

## Manifest validation

```bash
npm run validate   # homey app validate --level publish
```

Catches missing translations, assets, capability references and manifest errors at the level the App Store requires.

## Manual smoke test (on a Homey)

1. `homey app run`
2. Add one device of each driver via pairing.
3. For each device: change the value via a test Flow action → verify the changed trigger fires with correct `value`/`previous` tokens.
4. Toggle the switch/button from the device UI → verify triggers fire.
5. Virtual Number: set decimals/unit/range in device settings → verify rounding, clamping and unit display.
6. Virtual Text: test equals/contains conditions with and without the case-sensitive setting.
7. Restart the app (`homey app run` again) → verify all values survived.
