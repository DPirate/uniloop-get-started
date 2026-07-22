# Subtask 4: Particles and Pipe Entry Animation

## Description

Add visual feedback particles for jumping/landing and a pipe-entry animation before navigation.

### Task Requirements
- Dust particles appear when the knight lands after being airborne.
- Small motion lines appear when the knight jumps.
- When the player enters a pipe, the knight slides downward into the pipe.
- Navigation occurs only after the slide-down animation completes.

## Step-by-Step Changes

### Summary of modifications
Add a particle system in `PlatformerHome` that spawns short-lived divs on state changes. Add a pipe-entry state that pauses physics and animates the knight into the pipe before calling `router.visit`.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/PlatformerHome.tsx`

Add helper functions/components:

- `spawnParticles(type: 'jump' | 'land', x, y)` — adds particle objects to a state array.
- `Particle({ x, y, type })` — renders a short-lived CSS block with a fade-out animation.
- `handleEnterPipe(pipe)` — sets an entering-pipe state and starts the slide-down animation.
- `completePipeEntry(pipe)` — calls `router.visit` after the animation.

#### Modifications to Existing Code
**File:** `resources/js/components/game/PlatformerHome.tsx`

- Track previous grounded state to detect landing.
- Track previous jumping state to detect jump start.
- Track `enteringPipe` state.
- Pass `onEnterPipe: handleEnterPipe` to `usePlatformer`.
- Render particles from the particles state array.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
