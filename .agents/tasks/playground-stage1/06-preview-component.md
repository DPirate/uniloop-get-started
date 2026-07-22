# Subtask 6: PlaygroundPreview Component

## Description

Create the sandboxed iframe preview that renders transpiled user code in isolation, with error capture and display.

### Task Requirements
- Component at `resources/js/components/playground/preview.tsx`.
- Renders a `<iframe sandbox="allow-scripts">` — no `allow-same-origin` to enforce full isolation.
- Updates `iframe.srcdoc` when `transpiledCode` changes. The `transpiledCode` prop comes from either the worker output (during active editing) or the cached database value (when a saved component is loaded) — the preview component treats both identically.
- srcdoc template loads React 19 + ReactDOM 19 UMD from CDN, injects the transpiled code, and mounts a default-exported `App` component into `<div id="root">`.
- Captures runtime errors via `window.onerror` and `try/catch` around `ReactDOM.createRoot().render()`, posting them back to the parent via `postMessage`.
- Parent listens for `message` events of type `runtime-error` and displays them as an overlay.
- Shows `Skeleton` from `@/components/ui/skeleton` while waiting for the first successful transpilation.
- Shows error overlay (using existing `alert-error.tsx` component or a styled div) when `error` prop is non-null.
- User's component MUST export default a function component. The editor shows a preamble comment as a convention reminder.

### Code Changes

#### New Functions/Methods
**File:** `resources/js/components/playground/preview.tsx`

- `PlaygroundPreview({ transpiledCode, error, isTranspiling }: PlaygroundPreviewProps)` — default export.
- `buildSrcDoc(code: string): string` — returns the full HTML document string.
- `handleMessage(event: MessageEvent)` — filters for `event.data.type === 'runtime-error'` and surfaces the error.
- `useEffect` on `transpiledCode` — updates `iframeRef.current.srcdoc`.

#### srcdoc Template
```html
<!DOCTYPE html>
<html>
<body>
  <div id="root"></div>
  <script crossorigin src="https://unpkg.com/react@19/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.development.js"></script>
  <script>
    window.onerror = function(msg, source, lineno, colno, err) {
      window.parent.postMessage({ type: 'runtime-error', error: String(msg) }, '*');
    };
  </script>
  <script>${transpiledCode}</script>
  <script>
    try {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch(e) {
      window.parent.postMessage({ type: 'runtime-error', error: e.message }, '*');
    }
  </script>
</body>
</html>
```

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
- `resources/js/components/playground/preview.tsx`

#### TypeScript Props
```ts
type PlaygroundPreviewProps = {
    transpiledCode: string | null;
    error: string | null;
    isTranspiling: boolean;
};
```
