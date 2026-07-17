# Subtask 6: Auth-Aware Locked Pipe

## Description

Improve the Dashboard pipe for guests by showing a locked visual and a shake animation when they try to enter.

### Task Requirements
- When the user is a guest, the Dashboard pipe renders in a gray/locked style with a padlock icon (CSS block).
- Attempting to enter the locked pipe plays a brief shake animation on the pipe.
- After the shake, the user is redirected to the login page.

## Step-by-Step Changes

### Summary of modifications
Extend `Pipe.tsx` to accept a `locked` prop and render a padlock. Extend `PlatformerHome` to pass `locked` for the Dashboard pipe when `auth.user` is absent and handle the shake-before-redirect flow.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/Pipe.tsx`

Update props:

```ts
interface PipeProps {
    // existing props
    locked?: boolean;
    isShaking?: boolean;
}
```

Add a CSS-block padlock element when `locked` is true.

#### Modifications to Existing Code
**File:** `resources/js/components/game/PlatformerHome.tsx`

- Pass `locked={!auth.user}` to the Dashboard pipe.
- Track `shakingPipeId` state.
- In the Dashboard pipe's `onEnterPipe` callback, if the user is a guest, set `shakingPipeId`, wait for the shake animation, then `router.visit(login())`.

**File:** `resources/js/components/game/Pipe.tsx`

- Apply a CSS shake animation when `isShaking` is true.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
