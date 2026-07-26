# Subtask 4: usePlayground Hook

## Description

Create the `usePlayground` custom hook that manages all playground state, worker communication, debounced transpilation, and local-first persistence via Dexie (IndexedDB).

### Task Requirements
- Hook file at `resources/js/hooks/use-playground.ts`.
- Manages state: `sourceCode`, `transpiledCode`, `error`, `componentName`, `savedComponentId`, `isDirty`, `isTranspiling`, `components` (list from server).
- Spawns the transpile worker lazily on first edit (not on mount) and terminates it on unmount. Viewing a saved component does not spawn the worker — it uses cached `transpiledCode` from the server.
- Debounces transpilation at 300ms using a ref-based timer.
- Posts `{ type: 'transpile', source, id }` to the worker and handles `{ type: 'result', ... }` responses.
- Persists drafts to IndexedDB via Dexie instantly (`saveLocally`).
- Syncs to the Laravel backend via Wayfinder action functions (`saveToServer`) — sends both `source_code` and `transpiled_code`; non-blocking, fire-and-forget with optimistic UI.
- Loads a component from server data on mount when editing an existing one — populates `transpiledCode` directly from the server-provided `transpiled_code` field (no worker call).
- Exposes a clean API: `{ sourceCode, transpiledCode, error, componentName, isDirty, isTranspiling, components, setSourceCode, setComponentName, saveToServer, loadComponent, newComponent }`.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/hooks/use-playground.ts`

- `usePlayground({ components, component }: { components?: PlaygroundComponent[]; component?: PlaygroundComponent })` — main hook signature.
- Internal refs: `workerRef`, `transpileTimerRef`, `transpileIdRef`.
- `ensureWorker()` — lazily spawns the worker on first call (first edit); subsequent calls return the existing instance.
- `handleWorkerMessage(event)` — updates `transpiledCode`/`error`/`isTranspiling` from worker response (matches by `id` to ignore stale results).
- `scheduleTranspile(source)` — clears previous timer, sets 300ms timeout; calls `ensureWorker()` then posts to worker.
- `setSourceCode(code)` — updates state, marks `isDirty`, calls `scheduleTranspile`.
- `saveLocally()` — writes `{ serverId, name, sourceCode, transpiledCode, updatedAt }` to Dexie `drafts` table.
- `saveToServer()` — calls the `store` or `update` Wayfinder action depending on `savedComponentId`; sends both `source_code` and `transpiled_code`; on success clears `isDirty` and updates `savedComponentId`.
- `loadComponent(c: PlaygroundComponent)` — populates `sourceCode`, `transpiledCode` (from `c.transpiledCode`), `componentName`, `savedComponentId` from a server component object. No worker invocation.
- `newComponent()` — resets all state to defaults (empty editor).

#### Dexie Schema
Defined inside the hook module (or a separate `resources/js/lib/db.ts`):

```
Table: drafts
  key: id (auto-increment)
  fields: serverId (number?), name (string), sourceCode (string), transpiledCode (string), updatedAt (Date)
```

#### Modifications to Existing Code
None.

#### Database Changes
None (IndexedDB is client-side only).

#### Configuration Changes
None.

#### New Files
- `resources/js/hooks/use-playground.ts`
- `resources/js/lib/db.ts` (Dexie database definition — optional split for cleanliness)
