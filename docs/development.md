# Development

## Setup

```bash
npm install -g homey     # Homey CLI, once
npm install
```

## Daily workflow

```bash
npm run typecheck        # fast feedback while coding
npm test                 # unit tests
npm run lint             # eslint + prettier
homey app run            # run on your Homey with live logging
```

`homey app run` composes `app.json`, compiles the TypeScript and installs the app in development mode on the Homey you are logged in to (`homey login`). Changes to `.ts` files require a restart of `homey app run`.

## Project conventions

- TypeScript strict mode; no `any` unless interfacing with untyped Homey APIs.
- All user-facing text is translated in 10 languages (see `specs/localization.md`).
- Compose sources are the single source of truth; the root `app.json` is generated.
- Shared logic goes in `lib/`; drivers stay declarative (config objects only).
- Every exported helper in `lib/validators.ts` has unit tests.
- Formatting via Prettier; run `npm run lint:fix` before committing.

## Useful Homey CLI commands

| Command                              | Purpose                                     |
| ------------------------------------ | ------------------------------------------- |
| `homey login`                        | Authenticate the CLI                        |
| `homey app run`                      | Run with live log output (development mode) |
| `homey app install`                  | Install the current code permanently        |
| `homey app validate --level publish` | Validate manifest at App Store level        |
| `homey app publish`                  | Publish a new version to the App Store      |
| `homey app manage`                   | Open the app's dashboard                    |
