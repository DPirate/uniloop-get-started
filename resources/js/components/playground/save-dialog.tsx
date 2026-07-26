import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export type PlaygroundSaveDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (name: string) => void;
    initialName?: string;
};

export default function PlaygroundSaveDialog({
    open,
    onOpenChange,
    onSave,
    initialName,
}: PlaygroundSaveDialogProps) {
    const [name, setName] = useState<string>(initialName ?? '');

    const handleSubmit = useCallback(() => {
        const trimmed = name.trim();

        if (trimmed === '') {
            return;
        }

        onSave(trimmed);
        onOpenChange(false);
    }, [name, onSave, onOpenChange]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit],
    );

    const canSave = name.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Save component</DialogTitle>
                    <DialogDescription>
                        Name your component so you can find it later.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Input
                        autoFocus
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="My cool button"
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!canSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
