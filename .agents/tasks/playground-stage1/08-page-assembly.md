# Subtask 8: Save Dialog, Page Assembly & Navigation

## Description

Create the save dialog (Radix Dialog for naming new components), assemble the `playground.tsx` page with toolbar/editor/preview/browser, and add the "Playground" navigation item to the app sidebar.

### Task Requirements
- `PlaygroundSaveDialog` at `resources/js/components/playground/save-dialog.tsx` using existing `@/components/ui/dialog` primitives.
- Page at `resources/js/pages/playground.tsx` using `AppLayout` (authenticated sidebar layout).
- Page props: `components?: PlaygroundComponent[]` (deferred, for browser) and `component?: PlaygroundComponent` (when editing existing, includes both `sourceCode` and `transpiledCode`).
- Page renders a toolbar (component name input, Save button, Browse/New button) above a split-pane of editor + preview.
- When no active component is loaded, the split-pane is replaced by the `PlaygroundBrowser` grid.
- Save button opens `PlaygroundSaveDialog` for new components; for existing components it saves directly (update).
- Page sets `Head` title to "Playground" and defines a `layout` static property with breadcrumbs pointing to `playground.index`.
- Add a "Playground" nav item to the sidebar navigation following the existing nav structure.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/playground/save-dialog.tsx`
- `PlaygroundSaveDialog({ open, onOpenChange, onSave, initialName }: PlaygroundSaveDialogProps)` — default export.
- Contains: name `Input` (from `@/components/ui/input`), "Save" and "Cancel" `Button`s.
- Disables Save when name is empty.
- Calls `onSave(name)` on submit.

**File:** `resources/js/pages/playground.tsx`
- `Playground({ components, component }: PlaygroundPageProps)` — default export.
- Uses `usePlayground({ components, component })` hook.
- `handleSave()` — if `savedComponentId` is null, open save dialog; else call `saveToServer()`.
- `handleEdit(c)` — navigate to `playground.edit` route via Wayfinder.
- `handleDelete(c)` — call delete action, then refresh/navigate.
- `handleNew()` — reset state, navigate to `playground.index`.
- Layout:
  ```
  Toolbar: [Name Input] [Save Button] [Browse Button]
  ─────────────────────────────────────
  if activeComponent: Editor | Preview  (flex split)
  else: PlaygroundBrowser
  ```

#### Modifications to Existing Code
**File:** `resources/js/layouts/app/app-sidebar-layout.tsx` (or wherever the nav items array is defined)
- Add a "Playground" nav item with a relevant `lucide-react` icon (e.g., `Code2` or `Sparkles`) pointing to the `playground.index` route.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
- `resources/js/components/playground/save-dialog.tsx`
- `resources/js/pages/playground.tsx`

#### TypeScript Props
```ts
type PlaygroundPageProps = {
    components?: PlaygroundComponent[];
    component?: PlaygroundComponent;
};

type PlaygroundSaveDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string) => void;
    initialName?: string;
};
```

#### Page Layout Static Property
```tsx
Playground.layout = {
    breadcrumbs: [
        { title: 'Playground', href: playgroundIndex() },
    ],
};
```
