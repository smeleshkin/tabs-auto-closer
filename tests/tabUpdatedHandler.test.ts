import {beforeEach, describe, expect, test, vi} from 'vitest';

import {
    createTabUpdatedHandler,
    TabUpdatedHandlerDependencies,
} from 'src@/background/tabUpdatedHandler';
import {UrlGroup} from 'src@/types/urlGroup';

const matchingGroup: UrlGroup = {
    id: 'telegram',
    name: 'Telegram',
    matches: ['https:\\/\\/t\\.me\\/(.)*'],
    closeTimeout: 1000,
};

function createDependencies(
    groups: UrlGroup[] = [matchingGroup],
): TabUpdatedHandlerDependencies {
    return {
        getData: vi.fn().mockResolvedValue({groups}),
        removeTab: vi.fn().mockResolvedValue(undefined),
        updateStatistic: vi.fn().mockResolvedValue(undefined),
        setIcon: vi.fn(),
        setTimer: (callback, timeout) => setTimeout(callback, timeout),
        clearTimer: timer => clearTimeout(timer),
        defaultIcon: '/default.png',
        actionIcon: '/action.png',
        warn: vi.fn(),
    };
}

describe('tab updated handler', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    test('ignores a tab that has not completed loading', async () => {
        const dependencies = createDependencies();
        const handler = createTabUpdatedHandler(dependencies);

        await handler(1, {}, {status: 'loading', url: 'https://t.me/example'});

        expect(dependencies.getData).not.toHaveBeenCalled();
        expect(dependencies.setIcon).not.toHaveBeenCalled();
    });

    test('ignores a tab without a URL', async () => {
        const dependencies = createDependencies();
        const handler = createTabUpdatedHandler(dependencies);

        await handler(1, {}, {status: 'complete'});

        expect(dependencies.getData).not.toHaveBeenCalled();
    });

    test('marks a matching tab and closes it after the configured timeout', async () => {
        const dependencies = createDependencies();
        const handler = createTabUpdatedHandler(dependencies);

        await handler(42, {}, {status: 'complete', url: 'https://t.me/example'});

        expect(dependencies.setIcon).toHaveBeenCalledWith(42, '/action.png');
        expect(dependencies.removeTab).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(999);
        expect(dependencies.removeTab).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1);
        expect(dependencies.removeTab).toHaveBeenCalledWith(42);
        expect(dependencies.updateStatistic).toHaveBeenCalledOnce();
    });

    test('does not schedule a timer for a non-matching URL', async () => {
        const dependencies = createDependencies();
        const setTimer = vi.spyOn(dependencies, 'setTimer');
        const handler = createTabUpdatedHandler(dependencies);

        await handler(1, {}, {status: 'complete', url: 'https://example.com'});

        expect(setTimer).not.toHaveBeenCalled();
        expect(dependencies.setIcon).not.toHaveBeenCalled();
    });

    test('cancels a pending close after navigation to a non-matching URL', async () => {
        const dependencies = createDependencies();
        const clearTimer = vi.spyOn(dependencies, 'clearTimer');
        const handler = createTabUpdatedHandler(dependencies);

        await handler(7, {}, {status: 'complete', url: 'https://t.me/example'});
        await handler(7, {}, {status: 'complete', url: 'https://example.com'});
        await vi.runAllTimersAsync();

        expect(clearTimer).toHaveBeenCalledOnce();
        expect(dependencies.setIcon).toHaveBeenLastCalledWith(7, '/default.png');
        expect(dependencies.removeTab).not.toHaveBeenCalled();
    });

    test('updates statistics only after a successful tab removal', async () => {
        const dependencies = createDependencies();
        vi.mocked(dependencies.removeTab).mockRejectedValue(new Error('already closed'));
        const handler = createTabUpdatedHandler(dependencies);

        await handler(8, {}, {status: 'complete', url: 'https://t.me/example'});
        await vi.runAllTimersAsync();

        expect(dependencies.updateStatistic).not.toHaveBeenCalled();
        expect(dependencies.warn).toHaveBeenCalledWith(
            'Error in remove tab with id "8": Error: already closed',
        );
    });
});
