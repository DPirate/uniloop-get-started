# Subtask 3: Transpilation Web Worker

## Description

Create a Web Worker that imports `@babel/standalone` and transpiles JSX/TSX to JavaScript off the main thread. The worker receives source code, returns transpiled output or an error message, and never throws. The worker runs **only during active editing** — saved components use cached `transpiled_code` from the database and never invoke the worker.

### Task Requirements
- Worker file at `resources/js/workers/transpile.worker.ts`.
- Uses `@babel/standalone` with the `react` and `typescript` presets.
- Listens for `message` events shaped `{ type: 'transpile', source: string, id: number }`.
- Returns `{ type: 'result', code: string | null, error: string | null, id: number }`.
- Syntax errors are caught and returned as `error` string (never thrown).
- Worker is instantiated from the hook via `new Worker(new URL('@/workers/transpile.worker.ts', import.meta.url), { type: 'module' })` — Vite 8 supports this natively.
- Worker is spawned lazily on first edit (not on page mount) so viewing a saved component never pays the worker cold-start cost.
- Babel is only ever loaded inside the worker; it must not appear in the main bundle.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/workers/transpile.worker.ts`

- Import `@babel/standalone` at the top of the worker (bundled into the worker chunk by Vite, not the main bundle).
- `self.onmessage` handler:
  - Destructure `type`, `source`, `id` from the event data.
  - If `type !== 'transpile'`, ignore.
  - Wrap `Babel.transform(source, { presets: ['react', 'typescript'] })` in try/catch.
  - On success, post `{ type: 'result', code: result.code, error: null, id }`.
  - On failure, post `{ type: 'result', code: null, error: e.message, id }`.

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None — Vite 8 handles `new URL(..., import.meta.url)` worker syntax natively. No `vite.config.ts` change required.

#### New Files
- `resources/js/workers/transpile.worker.ts`

#### TypeScript Note
Add `@types/babel__standalone` to devDependencies for type safety inside the worker. The worker file is included by the existing `tsconfig.json` glob `resources/js/**/*.ts`.
