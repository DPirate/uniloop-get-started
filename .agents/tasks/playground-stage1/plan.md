# Ticket: Stage 1 — In-Browser React Component Playground

## Summary

A protected page at `/playground` where authenticated users write React component code in Monaco Editor, see a live preview in a sandboxed iframe, and save components to a database-backed library for future editing. This is Stage 1 only — a later Stage 2 will let users compose saved components into forms.

### Changes Required
- Add npm dependencies: `@monaco-editor/react`, `@babel/standalone`, `dexie`, `@types/babel__standalone`.
- Create migration for `playground_components` table (per-user ownership via `user_id`). Table stores both `source_code` and `transpiled_code` so saved components load pre-compiled without re-running the worker.
- Create `PlaygroundComponent` model with factory, `PlaygroundComponentRequest` form request, and `PlaygroundComponentController` with index/store/edit/update/destroy. Both `source_code` and `transpiled_code` are fillable and persisted on save.
- Register auth-protected routes in `routes/web.php` and regenerate Wayfinder types.
- Create web worker (`resources/js/workers/transpile.worker.ts`) for off-main-thread JSX transpilation via `@babel/standalone`. Worker runs **only during active editing**; saved components use cached transpiled output from the database.
- Create `usePlayground` hook managing source code, debounced transpilation, worker lifecycle (spawn on first edit, not on mount), and IndexedDB drafts via Dexie. `loadComponent` populates `transpiledCode` directly from server data — no worker call.
- Create `PlaygroundEditor` (lazy-loaded Monaco), `PlaygroundPreview` (sandboxed iframe with srcdoc), `PlaygroundBrowser` (card grid of saved components), and `PlaygroundSaveDialog` (Radix Dialog for naming).
- Create `resources/js/pages/playground.tsx` page assembling toolbar + editor/preview split + browser, using `AppLayout`.
- Add "Playground" navigation item to the app sidebar layout.
- Write Pest feature tests covering auth gating, CRUD, and ownership authorization.

### Environment Setup
- New npm dependencies (no composer dependencies).
- No new environment variables.
- Database: SQLite (existing) — new migration only.

### High-Level Use Case
An authenticated user navigates to `/playground`, sees a code editor and live preview side-by-side, and a browser of their saved components. They type React/JSX code; after 300ms of inactivity the code is transpiled in a web worker and rendered into a sandboxed iframe. They name and save the component (persisted to SQLite, cached locally in IndexedDB). Later they can return, browse saved components, and reopen any one for editing.

### Implementation Analysis

**Problem Statement:**
Users need a browser-based React component editor that is performant enough for real-time feedback while typing, persists work locally for instant save/load, and syncs to the server for cross-device access — all without compromising host app stability.

**Objectives:**
1. Real-time transpilation and preview with no perceptible lag (<50ms from keystroke to preview after init).
2. Local-first persistence via IndexedDB (instant save, no network wait).
3. Code isolation so user code cannot crash or pollute the host application.
4. Component library/browser to view and re-edit saved work.
5. Per-user ownership with auth gating.

**Constraints:**
- Must not add Monaco or Babel to the main bundle (eager load). Both must be code-split via dynamic `import()`.
- Transpilation must run off-main-thread in a Web Worker.
- Preview must render in a sandboxed iframe with `sandbox="allow-scripts"`.
- Must follow existing code conventions (Inertia pages, controller patterns, Pest tests, `cn()` utility, Radix UI primitives, `@/` path alias).
- Routes must be registered with Wayfinder for typed frontend access.
- Use `Inertia::optional()` (not `Inertia::lazy()` — removed in v3) for deferred props.

**Approach Options:**
1. **Monaco + Babel worker + iframe + IndexedDB + SQLite** — Full local-first architecture. Heaviest upfront but best UX.
2. **CodeMirror + Babel main-thread + iframe + SQLite only** — Lighter editor, no worker, no local cache. Simpler but main-thread jank and no offline.
3. **Server-side transpilation** — Send code to Laravel, transpile with PHP Babel port. Rejected: no PHP Babel port exists and round-trip latency kills live preview.

**Final Decision:**
Option 1. Performance and UX are the stated priorities. The worker keeps the 2MB Babel parse off the main thread; IndexedDB makes save/load instant; the iframe guarantees isolation. Transpiled output is cached in the database so reopening a saved component skips the worker entirely.

**Potential Risks and Mitigation:**
- **Bundle size:** Monaco (~2MB) and Babel (~2MB) are large. Mitigate by code-splitting both via dynamic import and web worker; neither enters the main bundle.
- **Worker cold start:** First transpile costs 80-150ms. Mitigate by deferring worker spawn to first edit (not page mount); saved components loaded from DB use cached transpiled output and never spawn the worker.
- **Stale transpiled code:** If React versions or Babel presets change, cached `transpiled_code` could be outdated. Mitigate by re-transpiling on save only (never on load); a migration script can batch-retranspile all stored components if presets change.
- **Runtime errors in user code:** Uncaught errors could blank the iframe. Mitigate with `window.onerror` handler in the iframe that posts errors back to the host for display.
- **Infinite loops in user code:** Could freeze the iframe. Acceptable for Stage 1 (iframe is isolated); the user can reload. Stage 2 may add a timeout watchdog.
- **Concurrent edits across devices:** IndexedDB and server can diverge. Mitigate by treating server as source of truth on page load (load from server, cache to IndexedDB), and IndexedDB as draft buffer only.

### Review with Lead
- Confirm React UMD CDN choice (unpkg) is acceptable vs. bundling React into the iframe srcdoc.
- Confirm 100KB source code limit is appropriate.
- Confirm `vs-dark` Monaco theme is acceptable (vs. matching app light/dark mode).
- Confirm whether unsaved-draft recovery (load from IndexedDB on mount) is desired or could surprise users.

### Missing Information
- Exact Monaco theme strategy (always dark vs. follow app appearance toggle) — plan defaults to `vs-dark`.
- Whether to add an "Are you sure?" guard when navigating away with unsaved changes — plan includes an `isDirty` flag but no route guard yet.
- Stage 2 (form builder) is explicitly out of scope for this spec; the Stage 1 architecture is designed to support it later without rewrite.
