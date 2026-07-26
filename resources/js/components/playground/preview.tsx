import { useCallback, useEffect, useState } from 'react';
import AlertError from '@/components/alert-error';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type PlaygroundPreviewProps = {
    transpiledCode: string | null;
    error: string | null;
    isTranspiling: boolean;
};

type RuntimeErrorMessage = {
    type: 'runtime-error';
    error: unknown;
};

function buildSrcDoc(code: string): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>html,body,#root{margin:0;padding:0;height:100%;}body{font-family:ui-sans-serif,system-ui,sans-serif;color:#1b1b18;background:#fff;}</style>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19",
    "react-dom/client": "https://esm.sh/react-dom@19/client"
  }
}
</script>
</head>
<body>
<div id="root"></div>
<script>
window.onerror = function (msg, source, lineno, colno, err) {
  window.parent.postMessage({ type: 'runtime-error', error: String(msg) }, '*');
};
</script>
<script type="module">
import React from 'react';
import { createRoot } from 'react-dom/client';
${code}
try {
  const root = createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
} catch (e) {
  window.parent.postMessage({ type: 'runtime-error', error: e instanceof Error ? e.message : String(e) }, '*');
}
</script>
</body>
</html>`;
}

export default function PlaygroundPreview({
    transpiledCode,
    error,
}: PlaygroundPreviewProps) {
    const [runtimeError, setRuntimeError] = useState<string | null>(null);
    const [prevTranspiledCode, setPrevTranspiledCode] = useState<string | null>(
        transpiledCode,
    );

    if (transpiledCode !== prevTranspiledCode) {
        setPrevTranspiledCode(transpiledCode);
        setRuntimeError(null);
    }

    const handleMessage = useCallback((event: MessageEvent) => {
        const data = event.data as RuntimeErrorMessage | null;

        if (data?.type !== 'runtime-error') {
            return;
        }

        setRuntimeError(
            typeof data.error === 'string' ? data.error : String(data.error),
        );

        return;
    }, []);

    useEffect(() => {
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [handleMessage]);

    if (error !== null) {
        return (
            <div
                className={cn(
                    'flex h-full w-full items-center justify-center p-4',
                )}
            >
                <AlertError errors={[error]} title="Transpile error" />
            </div>
        );
    }

    if (transpiledCode === null) {
        return <Skeleton className="h-full w-full" />;
    }

    return (
        <div className={cn('flex h-full w-full flex-col')}>
            {runtimeError !== null ? (
                <div className="p-3">
                    <AlertError errors={[runtimeError]} title="Runtime error" />
                </div>
            ) : null}
            <iframe
                sandbox="allow-scripts"
                srcDoc={buildSrcDoc(transpiledCode)}
                title="Playground preview"
                className="block h-full w-full border-0 bg-white"
            />
        </div>
    );
}
