import {LSData} from 'src@/utils/localStorage';
import {findMatchedGroup} from 'src@/utils/findMatchedGroup';

type Tab = {
    status?: string;
    url?: string;
};

type Timer = ReturnType<typeof setTimeout>;

export type TabUpdatedHandlerDependencies = {
    getData: () => Promise<LSData>;
    removeTab: (tabId: number) => Promise<void>;
    updateStatistic: () => Promise<void>;
    setIcon: (tabId: number, iconPath: string) => void;
    setTimer: (callback: () => void, timeout: number) => Timer;
    clearTimer: (timer: Timer) => void;
    defaultIcon: string;
    actionIcon: string;
    warn: (message: string) => void;
};

export function createTabUpdatedHandler({
    getData,
    removeTab,
    updateStatistic,
    setIcon,
    setTimer,
    clearTimer,
    defaultIcon,
    actionIcon,
    warn,
}: TabUpdatedHandlerDependencies) {
    const timeouts: Record<string, Timer> = {};

    return async (tabId: number, _changes: unknown, tab: Tab): Promise<void> => {
        if (tab.status !== 'complete' || !tab.url) {
            return;
        }

        const {groups} = await getData();
        const matchedGroup = findMatchedGroup(groups, tab.url);

        if (matchedGroup) {
            setIcon(tabId, actionIcon);

            const timeoutId = setTimer(() => {
                void (async () => {
                    try {
                        await removeTab(tabId);
                        await updateStatistic();
                    } catch (e) {
                        warn(`Error in remove tab with id "${tabId}": ${String(e)}`);
                    }
                })();
            }, matchedGroup.closeTimeout);
            timeouts[String(tabId)] = timeoutId;
            return;
        }

        const timeoutId = timeouts[String(tabId)];
        if (timeoutId) {
            clearTimer(timeoutId);
            delete timeouts[String(tabId)];
            setIcon(tabId, defaultIcon);
        }
    };
}
