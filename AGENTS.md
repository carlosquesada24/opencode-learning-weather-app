# AGENTS.md

Weather CLI app (Bun + OpenMeteo). Entrypoint is `src/index.ts`.

## Runtime & package manager

- **Bun, not Node.** Use `bun` commands. Lockfile is `bun.lock`; never add `package-lock.json`.
- Run the app with `bun run src/index.ts` (or `bun run start`). Build the binary with `bun run build`.
- Typecheck: `bunx tsc --noEmit` (tsconfig has `noEmit: true`, so `tsc` never writes output).
- No tests, linter, or formatter configured yet. Do not assume a test runner exists.

## TypeScript quirks (tsconfig.json)

- `verbatimModuleSyntax: true` → use `import type` for type-only imports.
- `allowImportingTsExtensions: true` and `moduleResolution: "bundler"` → imports may use `.ts` extensions; no `.js` build output.
- `module: "Preserve"`, `types: ["bun"]` → use Bun globals/types.

## App specifics

- User-facing UI strings are Spanish (README, menu example). Match that.
- OpenMeteo flow is two steps and needs **no API key**: geocoding API resolves city → lat/lon, then forecast API fetches weather.
  - `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
  - `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Goal includes producing a standalone executable (`bun build --compile`); `.gitignore` already ignores `out/` and `dist/`.
