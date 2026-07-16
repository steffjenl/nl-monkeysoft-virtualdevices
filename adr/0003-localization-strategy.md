# ADR-0003: Localization strategy

Date: 2026-07-15 · Status: accepted

## Decision

- Ten languages from day one: en, nl, de, fr, es, it, da, sv, no, pl. English is the fallback.
- Manifest strings (names, flow cards, args, tokens, settings, capability titles) are inline i18n objects in the compose JSON files — the Homey-native format, so validation and the App Store pipeline see them directly.
- Runtime strings (user-facing error messages) live in `locales/<lang>.json` and are resolved with `this.homey.__()`.
- Completeness is enforced by a unit test (`test/flow-compose.test.ts`) that fails when any flow-card string misses any of the ten languages or a card with arguments lacks `titleFormatted`.
- Fixed Dutch terminology per driver (Virtuele schakelaar / knop / getal / tekst / temperatuur / vermogen / batterij), see specs/localization.md.
- Translations were authored in-project (professional register, consistent terminology per language) rather than machine-dumped per string; native-speaker review before the first store release is recommended and listed in the release checklist.

## Consequences

- Adding a card means writing ten strings up front; the test suite makes forgetting impossible.
- Adding a language is mechanical (see specs/localization.md) but touches every compose file.
- Inline i18n keeps each card's translations next to its definition — larger JSON files, but no indirection layer to maintain.
