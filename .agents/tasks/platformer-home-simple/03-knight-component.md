# Subtask 3: Knight Component

## Description

Create a reusable CSS-block knight character component for the platformer.

### Task Requirements
- The knight must be rendered entirely with CSS/SVG blocks (no images).
- It must accept position, size, facing direction, and grounded state as props.
- It must visually distinguish facing left vs. right via CSS transform.
- Optional: include a subtle bobbing animation when grounded.

## Step-by-Step Changes

### Summary of modifications
Create a self-contained React component that renders the player as stacked/colored divs representing the body, helmet, visor, plume, and sword.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/Knight.tsx`

Create the default exported React component `Knight`:

```tsx
export default function Knight({ x, y, width, height, facingLeft, isGrounded }: KnightProps) {
    // JSX
}
```

Props interface:

```ts
interface KnightProps {
    x: number;
    y: number;
    width: number;
    height: number;
    facingLeft: boolean;
    isGrounded: boolean;
}
```

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
**File:** `resources/js/components/game/Knight.tsx`

The component uses absolute positioning (`left`, `top`, `width`, `height`) via inline styles. The body, helmet, visor, plume, and sword are separate `<div>` elements with Tailwind background and border utilities. The container is flipped horizontally with `scale-x-[-1]` when `facingLeft` is true.
