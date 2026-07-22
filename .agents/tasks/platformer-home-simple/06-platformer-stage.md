# Subtask 6: Platformer Home Stage

## Description

Create the game stage component that combines the physics hook, platforms, pipes, knight, and instructions.

### Task Requirements
- Render a fixed-size game world.
- Place a floor platform and four elevated platforms, each with a pipe.
- Wire each pipe to a page via Inertia `router.visit`.
- Render the `Knight` component at the player's position.
- Display brief control instructions.
- Handle auth-aware behavior for the Dashboard pipe.

## Step-by-Step Changes

### Summary of modifications
Create `PlatformerHome.tsx` that defines the world geometry, imports the `usePlatformer` hook, and renders all game elements. It reads `auth.user` from `usePage().props` to decide the Dashboard pipe behavior.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/PlatformerHome.tsx`

Create the default exported React component `PlatformerHome`:

```tsx
export default function PlatformerHome() {
    // component body
}
```

It uses:
- `usePlatformer` from `@/hooks/use-platformer`
- `Knight` from `@/components/game/Knight`
- `Pipe` from `@/components/game/Pipe`
- `router` from `@inertiajs/react`
- `usePage` from `@inertiajs/react`
- Route helpers from `@/routes`: `aboutMe`, `dashboard`, `feedbackCreate`, `login`, `settingsProfile`

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
**File:** `resources/js/components/game/PlatformerHome.tsx`

The component:
1. Defines `worldWidth`, `worldHeight`, `playerSize`.
2. Defines the floor platform and four elevated platforms with pipes.
3. Defines the pipe list with labels and target routes:
   - Pipe 1 → `aboutMe()`
   - Pipe 2 → `dashboard()` if authenticated, otherwise `login()`
   - Pipe 3 → `settingsProfile()`
   - Pipe 4 → `feedbackCreate()`
4. Calls `usePlatformer` with the world data and an `onEnterPipe` callback that runs `router.visit(pipeTarget)`.
5. Renders a container with absolute positioning, the platforms, the pipes, the knight, and instructions text.

### Open Questions

- Should the Dashboard pipe be hidden for guests, or visible-but-locked/redirected to login? The main plan proposes visible-but-locked/redirected.
