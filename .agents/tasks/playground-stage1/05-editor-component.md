# Subtask 5: PlaygroundEditor Component

## Description

Create the Monaco Editor wrapper component, lazy-loaded so the ~2MB editor never enters the main bundle.

### Task Requirements
- Component at `resources/js/components/playground/editor.tsx`.
- Uses `React.lazy(() => import('@monaco-editor/react'))` with `Suspense` fallback from `@/components/ui/skeleton`.
- Props: `value: string`, `onChange: (value: string) => void`.
- Language: `typescript` (enables JSX via Monaco's built-in TS support).
- Theme: `vs-dark`.
- Options: minimap disabled, fontSize 14, tabSize 2, wordWrap on, automaticLayout on, scrollBeyondLastLine false.
- `beforeMount` callback configures the TypeScript compiler options for JSX.
- Component follows existing `cn()` utility convention for any className merging.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/playground/editor.tsx`

- `PlaygroundEditor({ value, onChange }: PlaygroundEditorProps)` — default export.
- `handleBeforeMount(monaco)` — sets `monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ jsx: 'react', ... })`.
- `handleMount(editor)` — optional: focus editor on mount.
- Renders:
  ```tsx
  <Suspense fallback={<Skeleton className="h-full w-full" />}>
    <Editor ... />
  </Suspense>
  ```

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
- `resources/js/components/playground/editor.tsx`

#### TypeScript Props
```ts
type PlaygroundEditorProps = {
    value: string;
    onChange: (value: string) => void;
};
```
