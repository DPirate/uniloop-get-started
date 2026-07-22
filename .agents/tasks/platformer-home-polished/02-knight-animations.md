# Subtask 2: Knight Animations

## Description

Add CSS-based animation states to the knight: idle, run, jump, and fall.

### Task Requirements
- Idle: subtle breathing/bobbing.
- Run: leg blocks swing and body bobs.
- Jump: sword raised, body tilted up.
- Fall: sword lowered, body tilted down.
- The component must receive the current animation state from props.

## Step-by-Step Changes

### Summary of modifications
Extend `Knight.tsx` to conditionally apply CSS transforms and keyframe animations based on a new `state` prop (`'idle' | 'run' | 'jump' | 'fall'`).

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/Knight.tsx`

Update the component signature:

```tsx
interface KnightProps {
    x: number;
    y: number;
    width: number;
    height: number;
    facingLeft: boolean;
    state: 'idle' | 'run' | 'jump' | 'fall';
}
```

#### Modifications to Existing Code
**File:** `resources/js/components/game/Knight.tsx`

- Add CSS keyframe animations in a scoped `<style>` block or inline style tag.
- Apply animation classes conditionally based on `state`.
- Adjust sword/helmet transforms for jump and fall states.
- Update the `PlatformerHome` and `usePlatformer` consumers to pass/derive the state.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
