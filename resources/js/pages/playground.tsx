import { Head, router, usePage } from '@inertiajs/react';
import { FolderOpen, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { destroy as playgroundDestroy } from '@/actions/App/Http/Controllers/PlaygroundComponentController';
import PlaygroundBrowser from '@/components/playground/browser';
import PlaygroundEditor from '@/components/playground/editor';
import PlaygroundPreview from '@/components/playground/preview';
import PlaygroundSaveDialog from '@/components/playground/save-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlayground } from '@/hooks/use-playground';
import AppLayout from '@/layouts/app-layout';
import {
    edit as playgroundEdit,
    index as playgroundIndex,
} from '@/routes/playground';
import type { BreadcrumbItem, PlaygroundComponent } from '@/types';

export type PlaygroundPageProps = {
    components?: PlaygroundComponent[];
    component?: PlaygroundComponent;
};

export default function Playground({
    components,
    component,
}: PlaygroundPageProps) {
    const { props: pageProps } = usePage<PlaygroundPageProps>();
    const pageComponents = components ?? pageProps.components;
    const pageComponent = component ?? pageProps.component;

    const {
        sourceCode,
        transpiledCode,
        error,
        componentName,
        savedComponentId,
        isDirty,
        isTranspiling,
        setSourceCode,
        setComponentName,
        saveToServer,
        loadComponent,
        newComponent,
    } = usePlayground({ components: pageComponents, component: pageComponent });

    const [view, setView] = useState<'browser' | 'editor'>(() =>
        pageComponent !== undefined ? 'editor' : 'browser',
    );
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (pageProps.components === undefined) {
            router.reload({ only: ['components'] });
        }
    }, [pageProps.components]);

    const handleNew = useCallback(() => {
        newComponent();
        setView('editor');
        void router.visit(playgroundIndex.url(), {
            only: ['components'],
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    }, [newComponent]);

    const handleEdit = useCallback(
        (c: PlaygroundComponent) => {
            loadComponent(c);
            setView('editor');
            void router.visit(playgroundEdit.url(c.id), {
                only: ['component', 'components'],
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        },
        [loadComponent],
    );

    const handleDelete = useCallback((c: PlaygroundComponent) => {
        void router.delete(playgroundDestroy.url(c.id), {
            preserveScroll: true,
        });
    }, []);

    const handleSave = useCallback(() => {
        if (savedComponentId === null && componentName === '') {
            setIsSaveDialogOpen(true);

            return;
        }

        saveToServer();
    }, [savedComponentId, componentName, saveToServer]);

    const handleDialogSave = useCallback(
        (name: string) => {
            setComponentName(name);
            saveToServer();
        },
        [setComponentName, saveToServer],
    );

    const handleBrowse = useCallback(() => {
        setView('browser');
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Playground', href: playgroundIndex() },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Playground" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {view === 'editor' ? (
                    <div className="flex items-center gap-2">
                        <Input
                            value={componentName}
                            onChange={(event) =>
                                setComponentName(event.target.value)
                            }
                            placeholder="Component name"
                            className="flex-1"
                        />
                        <Button onClick={handleSave} disabled={!isDirty}>
                            <Save className="h-4 w-4" />
                            Save
                        </Button>
                        <Button variant="outline" onClick={handleBrowse}>
                            <FolderOpen className="h-4 w-4" />
                            Browse
                        </Button>
                    </div>
                ) : null}

                <div className="flex flex-1 gap-4">
                    {view === 'editor' ? (
                        <div className="grid flex-1 grid-cols-2 gap-4">
                            <div className="overflow-hidden rounded-xl border">
                                <PlaygroundEditor
                                    value={sourceCode}
                                    onChange={setSourceCode}
                                />
                            </div>
                            <div className="overflow-hidden rounded-xl border">
                                <PlaygroundPreview
                                    transpiledCode={transpiledCode}
                                    error={error}
                                    isTranspiling={isTranspiling}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <PlaygroundBrowser
                                components={pageProps.components}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onNew={handleNew}
                            />
                        </div>
                    )}
                </div>
            </div>

            <PlaygroundSaveDialog
                open={isSaveDialogOpen}
                onOpenChange={setIsSaveDialogOpen}
                onSave={handleDialogSave}
                initialName={componentName}
            />
        </AppLayout>
    );
}

Playground.layout = {
    breadcrumbs: [{ title: 'Playground', href: playgroundIndex() }],
};
