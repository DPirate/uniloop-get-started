import Dexie from 'dexie';

export type PlaygroundDraft = {
    id?: number;
    serverId: number | null;
    name: string;
    sourceCode: string;
    transpiledCode: string;
    updatedAt: Date;
};

export class PlaygroundDatabase extends Dexie {
    declare drafts: Dexie.Table<PlaygroundDraft, number>;

    constructor() {
        super('playground');

        this.version(1).stores({
            drafts: '++id, serverId, updatedAt',
        });
    }
}

export const db = new PlaygroundDatabase();
