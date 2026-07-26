import type { BeforeMount, OnChange, OnMount } from '@monaco-editor/react';
import { lazy, Suspense, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

export type PlaygroundEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function PlaygroundEditor({
    value,
    onChange,
}: PlaygroundEditorProps) {
    const handleChange: OnChange = useCallback(
        (code) => {
            onChange(code ?? '');

            return;
        },
        [onChange],
    );

    const handleBeforeMount: BeforeMount = useCallback((monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React,
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            esModuleInterop: true,
        });

        return;
    }, []);

    const handleMount: OnMount = useCallback((editor) => {
        editor.focus();

        return;
    }, []);

    return (
        <div className={cn('flex h-full w-full flex-col')}>
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <MonacoEditor
                    height="100%"
                    language="typescript"
                    theme="vs-dark"
                    value={value}
                    onChange={handleChange}
                    beforeMount={handleBeforeMount}
                    onMount={handleMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        tabSize: 2,
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                    }}
                />
            </Suspense>
        </div>
    );
}
