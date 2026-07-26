# Subtask 10: Verification & Formatting

## Description

Run all lint, type-check, formatting, and test commands to verify the implementation is correct and follows project conventions.

### Task Requirements
- Install the new npm dependencies and confirm they resolve.
- Run PHP formatting with Pint on all modified/created PHP files.
- Run TypeScript type-checking.
- Run ESLint on the frontend code.
- Run the full Pest test suite (not just the new tests) to confirm no regressions.
- Run the new Playground tests specifically.

### Commands (in order)

1. `npm install` — install `@monaco-editor/react`, `@babel/standalone`, `dexie`, `@types/babel__standalone`.
2. `php artisan migrate` — run the new migration (already done in Subtask 1, confirm here).
3. `php artisan wayfinder:generate` — confirm Wayfinder types are generated (already done in Subtask 2, confirm here).
4. `vendor/bin/pint --format agent` — format all PHP files per `pint.json`.
5. `npm run types:check` — run `tsc --noEmit` to verify no type errors.
6. `npm run lint` — run ESLint with `--fix` on the frontend code.
7. `npm run format` — run Prettier on `resources/`.
8. `php artisan test --compact --filter=Playground` — run only the new Playground tests.
9. `php artisan test --compact` — run the full test suite to confirm no regressions.

### Acceptance Criteria
- All Pint formatting passes (no diff after formatting).
- `tsc --noEmit` exits 0.
- ESLint exits 0.
- All Playground tests pass (13 tests).
- Full test suite passes with no regressions.
- `npm run build` succeeds (confirms Vite can bundle the worker and lazy chunks).

### Code Changes
None.

#### New Files
None.
