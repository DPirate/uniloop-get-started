# Subtask 3: Camera Follow and Parallax Background

## Description

Add a camera that follows the knight across a wider world and add parallax background layers for depth.

### Task Requirements
- The game world can be wider than the viewport.
- The camera keeps the knight centered horizontally, clamped to world bounds.
- Background layers move at different speeds relative to the camera to create parallax.
- The existing game elements remain positioned in world coordinates.

## Step-by-Step Changes

### Summary of modifications
Add camera offset state to `PlatformerHome` and apply a CSS transform to the world container. Add background layer divs that translate at fractions of the camera offset.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/PlatformerHome.tsx`

Add internal helpers:

- `calculateCameraOffset(playerX): number` — centers player and clamps to `[0, worldWidth - viewportWidth]`.
- `ParallaxLayer({ speed, children })` — translates children by `cameraOffset * speed`.

#### Modifications to Existing Code
**File:** `resources/js/components/game/PlatformerHome.tsx`

- Wrap the game world contents in a camera-transformed container.
- Increase `worldWidth` if it is currently equal to the viewport width.
- Add far, mid, and near background layers with CSS-block shapes (clouds, hills, ground details).
- Pass the camera offset to the parallax layers.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
