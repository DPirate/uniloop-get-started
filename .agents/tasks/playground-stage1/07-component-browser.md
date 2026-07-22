# Subtask 7: PlaygroundBrowser Component

## Description

Create the component browser — a responsive card grid listing the user's saved components with edit and delete actions, plus a "New Component" entry.

### Task Requirements
- Component at `resources/js/components/playground/browser.tsx`.
- Renders a responsive grid: 3 columns on desktop, 2 on tablet, 1 on mobile (Tailwind: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- First card is "New Component" with a `Plus` icon from `lucide-react` and calls `onNew` callback.
- Each saved component card shows: name, last-updated date (formatted), "Edit" button, "Delete" button.
- "Edit" calls `onEdit(component)` callback.
- "Delete" calls `onDelete(component)` callback (parent handles confirmation + server call).
- Uses deferred-prop pattern: renders `Skeleton` cards while `components` is undefined/loading.
- Empty state: "No saved components yet. Create your first one!" centered with a `Plus` icon.
- Uses existing UI primitives: `Button` from `@/components/ui/button`, `Card` from `@/components/ui/card`.
- Follows `cn()` convention for className merging.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/playground/browser.tsx`

- `PlaygroundBrowser({ components, onEdit, onDelete, onNew }: PlaygroundBrowserProps)` — default export.
- `formatDate(iso: string): string` — formats ISO date to a readable relative/absolute string.
- Renders skeleton grid when `components === undefined`.
- Renders empty state when `components` is an empty array.
- Renders card grid otherwise.

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
- `resources/js/components/playground/browser.tsx`

#### TypeScript Props
```ts
type PlaygroundBrowserProps = {
    components: PlaygroundComponent[] | undefined;
    onEdit: (component: PlaygroundComponent) => void;
    onDelete: (component: PlaygroundComponent) => void;
    onNew: () => void;
};
```
