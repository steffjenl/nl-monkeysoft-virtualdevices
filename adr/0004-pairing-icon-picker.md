# ADR-0004: Custom pairing view with icon picker

Date: 2026-07-16 · Status: accepted (supersedes the pairing section of ADR-0002)

## Context

Users want to give a virtual device its own icon instead of the driver's default. Homey only allows an app to set a device icon **at pairing time** (the `icon` property of the device object); it cannot be changed programmatically afterwards.

## Decision

- Every driver uses one shared custom pairing view (`pair/start.html`) instead of the `list_devices`/`add_devices` templates. The view shows a name field (prefilled with the localized driver name) and an icon grid, then calls `Homey.createDevice({ name, data: { id }, icon: '/icons/<name>.svg' })` followed by `Homey.done()`.
- The backend (`BaseVirtualDriver.onPair`) only serves a `getPairInfo` handler returning the localized default name and a fresh UUID.
- **Single source of truth**: icons live in `assets/device-icons/` (27 self-made SVGs: one per driver type plus generic ones — home, bell, star, clock, fan, car, plant, window, trash, waste-container, kliko, …) and the view lives in `pairing/start.template.html`. `npm run sync:pairing` (scripts/sync-pairing.js) copies the icons to every `drivers/<id>/assets/icons/` and generates every `drivers/<id>/pair/start.html` with the icon grid inlined and the driver's default icon preselected.
- Generated pair files and the icon source directory are excluded from Prettier (`drivers/*/pair/`) and from the app bundle where irrelevant (`pairing/`, `assets/device-icons/` in `.homeyignore` — the per-driver copies ship instead).
- View texts come from `locales/*.json` (`pair.*` keys) via `Homey.__()`, so all ten languages work in the pairing dialog.

## Consequences

- Icons must be duplicated per driver (Homey resolves device icons relative to the driver's assets folder); the sync script makes that a non-issue but it must be re-run after adding icons (`npm run sync:pairing`).
- Apps cannot change a device's icon after pairing — confirmed platform limitation (device icons are static; no SDK/API mechanism exists). Users can still change the icon themselves in the Homey mobile app (v6.8.0+, device settings → change icon) or remove and re-add the device. Documented in the README and shown as a hint in the pairing view.
- The pairing view guards against partial failures: click handlers are wired before translations are applied, the icon grid scrolls (max-height with overflow), and the selected icon gets a strong highlight (blue border, background, checkmark badge) so the choice is always visible.
- Adding a new icon = drop an SVG in `assets/device-icons/` + run the sync script; it appears in every driver's picker automatically.
