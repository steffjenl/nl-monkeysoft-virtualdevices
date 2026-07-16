# Localization

## Languages

en (fallback), nl, de, fr, es, it, da, sv, no, pl — every user-visible string exists in all ten.

## Where translations live

| Content                        | Location                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
| App name/description           | `.homeycompose/app.json` (inline i18n objects)                                                |
| Driver names                   | `drivers/*/driver.compose.json`                                                               |
| Flow card titles, args, tokens | `drivers/*/driver.flow.compose.json`                                                          |
| Custom capability titles       | `.homeycompose/capabilities/*.json`                                                           |
| Device settings labels/hints   | `drivers/*/driver.settings.compose.json`                                                      |
| Runtime strings (errors)       | `locales/<lang>.json`, used via `this.homey.__('errors.…')`                                   |
| Pairing view texts             | `locales/<lang>.json` (`pair.*` keys), used via `Homey.__()` in `pairing/start.template.html` |
| App Store changelog            | `.homeychangelog.json` (en + nl)                                                              |

Homey falls back to `en` automatically when a language key is missing; the test suite (`test/flow-compose.test.ts`) nevertheless enforces all ten languages on every flow card so the fallback is never needed.

## Terminology

Dutch driver names are fixed project terminology:

| Driver              | nl                        |
| ------------------- | ------------------------- |
| virtual-boolean     | Virtuele schakelaar       |
| virtual-button      | Virtuele knop             |
| virtual-number      | Virtueel getal            |
| virtual-string      | Virtuele tekst            |
| virtual-temperature | Virtuele temperatuur      |
| virtual-power       | Virtueel vermogen         |
| virtual-battery     | Virtuele batterij         |
| virtual-humidity    | Virtuele luchtvochtigheid |
| virtual-luminance   | Virtuele helderheid       |
| virtual-pressure    | Virtuele luchtdruk        |
| virtual-co2         | Virtuele CO2              |
| virtual-contact     | Virtueel contact          |
| virtual-motion      | Virtuele bewegingssensor  |
| virtual-dimmer      | Virtuele dimmer           |
| virtual-energy      | Virtuele energiemeter     |

Note (Danish): the Virtual Switch is "Virtuel afbryder" and the Virtual Contact is "Virtuel kontaktsensor" to keep the two distinguishable.

Consistent word choices across all cards per language, e.g. nl "waarde/ingeschakeld/omgeschakeld", de "Wert/eingeschaltet/umgeschaltet", sv "värde/påslagen/växlad". Conditions use Homey's invertible `!{{…|…}}` syntax in every language.

## Adding a language

1. Add the language key to every i18n object in the compose files (the flow-compose test will list what is missing once added to its `LANGUAGES` array).
2. Add `locales/<lang>.json`.
3. Run `npm test && npm run validate`.
