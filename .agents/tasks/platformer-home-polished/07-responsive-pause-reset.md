# Subtask 7: Responsive Scaling, Pause, and Reset

## Description

Make the game stage scale gracefully on small viewports and expose pause/reset controls.

### Task Requirements
- On narrow screens, scale the fixed-resolution game stage down to fit the viewport width.
- Add pause toggle using `P` or `Escape` with a visible paused overlay.
- Add reset to starting position using `R`.

## Step-by-Step Changes

### Summary of modifications
Add a CSS transform scale wrapper around the game stage based on viewport width. Wire pause and reset into the physics hook and render overlays/state feedback.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/PlatformerHome.tsx`

Add helpers:

- `calculateStageScale(): number` — returns `Math.min(1, viewportWidth / worldWidth)`.
- `PausedOverlay()` — dimmed overlay with "Paused" text.
- `ResetHint()` — small on-screen hint for the reset key.

#### Modifications to Existing Code
**File:** `resources/js/components/game/PlatformerHome.tsx`

- Measure viewport width (e.g., via `window.innerWidth` or a resize listener).
- Wrap the game stage in a scaled container using `transform: scale(...)` and origin-top-center.
- Render `PausedOverlay` when `isPaused` from `usePlatformer` is true.
- Display a subtle reset hint.

**File:** `resources/js/hooks/use-platformer.ts`

- Expose `isPaused` and `reset` in the returned state.
- Ensure `R` key triggers `resetPlayer()`.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
