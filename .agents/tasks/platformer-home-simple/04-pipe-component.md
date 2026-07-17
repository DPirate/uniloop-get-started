# Subtask 4: Pipe Component

## Description

Create a reusable Mario-style pipe component used to navigate between pages.

### Task Requirements
- The pipe must be rendered entirely with CSS blocks.
- It must accept position, size, and an optional label.
- It must visually resemble a classic Mario pipe: green tube with a darker rim.
- It must not handle navigation logic itself; that is managed by the physics hook and stage.

## Step-by-Step Changes

### Summary of modifications
Create a presentational React component that draws a pipe from stacked divs and an optional label above it.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/game/Pipe.tsx`

Create the default exported React component `Pipe`:

```tsx
export default function Pipe({ x, y, width, height, label }: PipeProps) {
    // JSX
}
```

Props interface:

```ts
interface PipeProps {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
}
```

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
**File:** `resources/js/components/game/Pipe.tsx`

The component renders:
- A top rim div (wider, darker green).
- A tube div below it (lighter green).
- An optional label centered above the pipe.
- Inline styles for absolute positioning and dynamic dimensions.
