import * as Babel from '@babel/standalone';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/PlaygroundComponentController';
import { db } from '@/lib/db';
import type { PlaygroundComponent } from '@/types';

export type UsePlaygroundProps = {
    components?: PlaygroundComponent[];
    component?: PlaygroundComponent;
};

export type UsePlaygroundReturn = {
    sourceCode: string;
    transpiledCode: string | null;
    error: string | null;
    componentName: string;
    savedComponentId: number | null;
    isDirty: boolean;
    isTranspiling: boolean;
    components: PlaygroundComponent[];
    setSourceCode: (code: string) => void;
    setComponentName: (name: string) => void;
    saveToServer: () => void;
    loadComponent: (component: PlaygroundComponent) => void;
    newComponent: () => void;
};

const TRANSPILE_DEBOUNCE_MS = 300;

export const STARTER_SOURCE = `// Components must default-export a function called App to render in the preview.
// The preview iframe does not load Tailwind - use inline styles.
function Input({ type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      style={{
        display: 'flex',
        height: 36,
        width: '100%',
        minWidth: 0,
        borderRadius: 6,
        border: '1px solid hsl(0 0% 80%)',
        background: 'transparent',
        padding: '8px 12px',
        fontSize: 14,
        fontFamily: 'inherit',
        outline: 'none',
      }}
      {...props}
    />
  );
}

export default function App() {
  return (
    <div style={{ padding: 24, maxWidth: 360, fontFamily: 'system-ui, sans-serif' }}>
      <Input type="text" placeholder="Type here..." />
    </div>
  );
}
`;

export const STARTER_TRANSPILED_CODE = `function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Components must default-export a function called App to render in the preview.
// The preview iframe does not load Tailwind - use inline styles.
function Input({
  type,
  ...props
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    "data-slot": "input",
    style: {
      display: 'flex',
      height: 36,
      width: '100%',
      minWidth: 0,
      borderRadius: 6,
      border: '1px solid hsl(0 0% 80%)',
      background: 'transparent',
      padding: '8px 12px',
      fontSize: 14,
      fontFamily: 'inherit',
      outline: 'none'
    }
  }, props));
}
export default function App() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      maxWidth: 360,
      fontFamily: 'system-ui, sans-serif'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    type: "text",
    placeholder: "Type here..."
  }));
}
`;

export function usePlayground({
    components: initialComponents,
    component: initialComponent,
}: UsePlaygroundProps = {}): UsePlaygroundReturn {
    const [sourceCode, setSourceCodeState] = useState<string>(
        initialComponent?.source_code ?? STARTER_SOURCE,
    );
    const [transpiledCode, setTranspiledCode] = useState<string | null>(
        initialComponent?.transpiled_code ?? STARTER_TRANSPILED_CODE,
    );
    const [error, setError] = useState<string | null>(null);
    const [componentName, setComponentNameState] = useState<string>(
        initialComponent?.name ?? '',
    );
    const [savedComponentId, setSavedComponentId] = useState<number | null>(
        initialComponent?.id ?? null,
    );
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isTranspiling, setIsTranspiling] = useState<boolean>(false);
    const [components] = useState<PlaygroundComponent[]>(
        initialComponents ?? [],
    );

    const transpileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    useEffect(() => {
        return () => {
            if (transpileTimerRef.current !== null) {
                clearTimeout(transpileTimerRef.current);
            }
        };
    }, []);

    const scheduleTranspile = useCallback((source: string) => {
        if (transpileTimerRef.current !== null) {
            clearTimeout(transpileTimerRef.current);
        }

        transpileTimerRef.current = setTimeout(() => {
            setIsTranspiling(true);

            try {
                const result = Babel.transform(source, {
                    filename: 'component.tsx',
                    presets: ['react', 'typescript'],
                });
                const code = result?.code ?? null;

                setError(null);
                setTranspiledCode(code);
            } catch (transpileError) {
                setError(
                    transpileError instanceof Error
                        ? transpileError.message
                        : String(transpileError),
                );
                setTranspiledCode(null);
            } finally {
                setIsTranspiling(false);
            }
        }, TRANSPILE_DEBOUNCE_MS);
    }, []);

    const saveLocally = useCallback((): void => {
        const draft = {
            serverId: savedComponentId,
            name: componentName,
            sourceCode,
            transpiledCode: transpiledCode ?? '',
            updatedAt: new Date(),
        };

        void db.drafts.add(draft);
    }, [componentName, savedComponentId, sourceCode, transpiledCode]);

    const isMountedRef = useRef<boolean>(false);

    useEffect(() => {
        if (!isMountedRef.current) {
            isMountedRef.current = true;

            return;
        }

        saveLocally();
    }, [saveLocally]);

    const setSourceCode = useCallback(
        (code: string) => {
            setSourceCodeState(code);
            setIsDirty(true);
            setError(null);
            scheduleTranspile(code);
        },
        [scheduleTranspile],
    );

    const setComponentName = useCallback((name: string) => {
        setComponentNameState(name);
        setIsDirty(true);
    }, []);

    const saveToServer = useCallback((): void => {
        const data = {
            name: componentName,
            source_code: sourceCode,
            transpiled_code: transpiledCode ?? '',
        };

        if (savedComponentId !== null) {
            router.visit(update.url(savedComponentId), {
                method: 'patch',
                data,
                preserveScroll: true,
                preserveState: true,
                only: ['component'],
                onSuccess: () => {
                    setIsDirty(false);
                    void router.reload({ only: ['components'] });
                },
            });

            return;
        }

        router.visit(store.url(), {
            method: 'post',
            data,
            preserveScroll: true,
            preserveState: true,
            only: ['component'],
            onSuccess: (page) => {
                const created = page.props.component as
                    | PlaygroundComponent
                    | undefined;

                if (created !== undefined) {
                    setSavedComponentId(created.id);
                }

                setIsDirty(false);
                void router.reload({ only: ['components'] });
            },
        });
    }, [componentName, savedComponentId, sourceCode, transpiledCode]);

    const loadComponent = useCallback((component: PlaygroundComponent) => {
        setSourceCodeState(component.source_code);
        setTranspiledCode(component.transpiled_code);
        setComponentNameState(component.name);
        setSavedComponentId(component.id);
        setIsDirty(false);
        setError(null);
        setIsTranspiling(false);

        if (transpileTimerRef.current !== null) {
            clearTimeout(transpileTimerRef.current);
            transpileTimerRef.current = null;
        }
    }, []);

    const newComponent = useCallback(() => {
        setSourceCodeState(STARTER_SOURCE);
        setTranspiledCode(STARTER_TRANSPILED_CODE);
        setComponentNameState('');
        setSavedComponentId(null);
        setIsDirty(false);
        setError(null);
        setIsTranspiling(false);

        if (transpileTimerRef.current !== null) {
            clearTimeout(transpileTimerRef.current);
            transpileTimerRef.current = null;
        }
    }, []);

    return {
        sourceCode,
        transpiledCode,
        error,
        componentName,
        savedComponentId,
        isDirty,
        isTranspiling,
        components,
        setSourceCode,
        setComponentName,
        saveToServer,
        loadComponent,
        newComponent,
    };
}