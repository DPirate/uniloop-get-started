import * as Babel from '@babel/standalone';

export type TranspileRequest = {
    type: 'transpile';
    source: string;
    id: number;
};

export type TranspileResult = {
    type: 'result';
    code: string | null;
    error: string | null;
    id: number;
};

type WorkerScope = {
    onmessage: ((event: MessageEvent<TranspileRequest>) => void) | null;
    postMessage: (message: TranspileResult) => void;
};

const workerScope = self as unknown as WorkerScope;

workerScope.onmessage = (event) => {
    const { type, source, id } = event.data;

    if (type !== 'transpile') {
        return;
    }

    try {
        const result = Babel.transform(source, {
            presets: ['react', 'typescript'],
        });

        const code = result?.code ?? null;

        workerScope.postMessage({ type: 'result', code, error: null, id });

        return;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        workerScope.postMessage({
            type: 'result',
            code: null,
            error: message,
            id,
        });

        return;
    }
};
