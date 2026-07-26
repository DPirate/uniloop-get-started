import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { PlaygroundComponent } from '@/types';

export type PlaygroundBrowserProps = {
    components: PlaygroundComponent[] | undefined;
    onEdit: (component: PlaygroundComponent) => void;
    onDelete: (component: PlaygroundComponent) => void;
    onNew: () => void;
};

const SKELETON_CARD_COUNT = 6;

function formatDate(iso: string): string {
    const date = new Date(iso);

    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}

function SkeletonGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
                <Skeleton key={index} className="h-40 w-full" />
            ))}
        </div>
    );
}

function EmptyState({ onNew }: { onNew: () => void }) {
    return (
        <Card className="border-dashed">
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                    No saved components yet. Create your first one!
                </p>
                <Button onClick={onNew} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                    New Component
                </Button>
            </div>
        </Card>
    );
}

export default function PlaygroundBrowser({
    components,
    onEdit,
    onDelete,
    onNew,
}: PlaygroundBrowserProps) {
    if (components === undefined) {
        return <SkeletonGrid />;
    }

    if (components.length === 0) {
        return <EmptyState onNew={onNew} />;
    }

    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3',
            )}
        >
            <Button
                onClick={onNew}
                variant="outline"
                className="flex h-auto min-h-32 flex-col items-center justify-center gap-2 rounded-xl border-dashed p-6 hover:border-primary/50 hover:bg-accent"
            >
                <Plus className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium">New Component</span>
            </Button>

            {components.map((component) => (
                <Card key={component.id}>
                    <CardHeader>
                        <CardTitle className="truncate">
                            {component.name}
                        </CardTitle>
                        <CardDescription>
                            Updated {formatDate(component.updated_at)}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(component)}
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(component)}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
