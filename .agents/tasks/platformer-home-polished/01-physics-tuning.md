# Subtask 1: Physics Tuning

## Description

Improve the platformer physics hook with variable jump height, acceleration-based movement, friction, coyote time, jump buffering, pause, and reset.

### Task Requirements
- Releasing the jump key early must cut the upward velocity, producing variable jump height.
- Horizontal movement must use acceleration and friction rather than instant velocity.
- Add a short coyote-time window after leaving a platform where jumping is still allowed.
- Add a short jump-buffer window where pressing jump slightly before landing still triggers a jump.
- Add pause toggle with `P` or `Escape`.
- Add reset to start position with `R`.

## Step-by-Step Changes

### Summary of modifications
Extend `usePlatformer` to track additional state: jump key held state, coyote timer, jump buffer timer, paused state, and reset key. Update the game loop to apply acceleration/friction and the new timing rules.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/hooks/use-platformer.ts`

Add/update internal helpers:

- `applyHorizontalMovement()` — uses `acceleration` and `friction` instead of direct velocity assignment.
- `applyJump()` — respects coyote time, jump buffer, and variable jump height.
- `togglePause()` — flips the paused flag.
- `resetPlayer()` — returns the player to the starting position and clears velocity.

Updated hook signature options:

```ts
interface UsePlatformerOptions {
    // existing options
    acceleration: number;
    friction: number;
    maxRunSpeed: number;
    coyoteTime: number;
    jumpBuffer: number;
}
```

#### Modifications to Existing Code
**File:** `resources/js/hooks/use-platformer.ts`

- Replace direct `vx = moveSpeed` logic with acceleration/friction.
- Add refs for `jumpHeld`, `coyoteTimer`, `jumpBufferTimer`.
- Add event handling for `P`, `Escape`, and `R` keys.
- Skip physics updates when paused.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
