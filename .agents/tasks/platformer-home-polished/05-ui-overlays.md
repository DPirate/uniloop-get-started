# Subtask 5: UI Overlays and Pipe Labels

## Description

Add floating labels above pipes and a dismissible instructions overlay.

### Task Requirements
- Each pipe displays its target page label above it.
- Labels fade in when the knight is near or standing on the pipe.
- An instructions overlay explains controls on first visit.
- The overlay is dismissible and its dismissed state is stored in `localStorage`.

## Step-by-Step Changes

### Summary of modifications
Extend `PlatformerHome` to render label elements tied to each pipe and an overlay component that checks `localStorage` on mount.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/PlatformerHome.tsx`

Add helper components:

- `PipeLabel({ pipe, isActive })` — fades in/out based on proximity.
- `InstructionsOverlay({ onDismiss })` — modal with control hints and a dismiss button.

#### Modifications to Existing Code
**File:** `resources/js/components/game/PlatformerHome.tsx`

- Render a `PipeLabel` for each pipe, computing `isActive` by comparing player position to pipe position.
- On mount, check `localStorage.getItem('platformer-instructions-dismissed')`.
- If not dismissed, render `InstructionsOverlay`.
- On dismiss, set the localStorage flag.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
