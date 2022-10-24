export enum MESSAGE_EVENTS {
    TAB_WAS_OPEN = 'TAB_WAS_OPEN',
}

export const createTabWasOpenMessage = (url: string) => ({
    type: MESSAGE_EVENTS.TAB_WAS_OPEN,
    url,
});

export type MessageTypes =
    ReturnType<typeof createTabWasOpenMessage>;
