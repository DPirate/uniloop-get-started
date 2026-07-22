# Subtask 5: Physics Hook

## Description

Create a custom React hook that powers the platformer physics: gravity, movement, jumping, platform collision, and pipe entry detection.

### Task Requirements
- Support ArrowLeft/ArrowRight, A/D, and Space controls.
- Apply gravity every frame and cap vertical velocity.
- Allow jumping only when grounded.
- Resolve collisions with platforms and keep the player on top of platforms.
- Detect when the player stands on a pipe and triggers navigation.
- Keep the player within world bounds.
- Use `requestAnimationFrame` for the game loop.

## Step-by-Step Changes

### Summary of modifications
Implement `usePlatformer` as a self-contained hook that returns player state and pipe interaction events. The hook will manage keyboard input, velocity, position, and collision resolution.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/hooks/use-platformer.ts`

Create and export the hook:

```tsx
export function usePlatformer(options: UsePlatformerOptions): UsePlatformerState {
    // hook body
}
```

Key helper functions inside the hook:
- `isKeyDown(code: string): boolean` — check active keys.
- `checkCollision(rect1, rect2): boolean` — AABB collision check.
- `resolveCollisions(player, platforms): void` — snap player to platform tops and stop vertical velocity.
- `detectPipeEntry(player, pipes): Pipe | null` — return the pipe the player is standing on.

Types:

```ts
interface Platform { x: number; y: number; width: number; height: number; }
interface Pipe { x: number; y: number; width: number; height: number; route: string; label: string; }
interface UsePlatformerOptions {
    worldWidth: number;
    worldHeight: number;
    playerSize: { width: number; height: number };
    gravity: number;
    jumpStrength: number;
    moveSpeed: number;
    platforms: Platform[];
    pipes: Pipe[];
    onEnterPipe: (pipe: Pipe) => void;
}
interface UsePlatformerState {
    player: { x: number; y: number; vx: number; vy: number };
    facingLeft: boolean;
    isGrounded: boolean;
    activePipe: Pipe | null;
}
```

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
**File:** `resources/js/hooks/use-platformer.ts`

The hook:
1. Initializes player position and velocity refs/state.
2. Adds `keydown` and `keyup` listeners.
3. Runs a `requestAnimationFrame` loop.
4. Each frame:
   - Reads input and updates horizontal velocity.
   - Applies jump if Space is pressed and grounded.
   - Applies gravity.
   - Moves horizontally, resolves collisions.
   - Moves vertically, resolves collisions, determines grounded state.
   - Checks world bounds.
   - Detects pipe entry and calls `onEnterPipe`.

Constants (tunable):
- `gravity = 0.6`
- `jumpStrength = -12`
- `moveSpeed = 5`
- `terminalVelocity = 12`
