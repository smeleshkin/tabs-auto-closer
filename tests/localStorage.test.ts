import {beforeEach, describe, expect, test, vi} from 'vitest';

import {getLSData, saveLSData} from 'src@/utils/localStorage/core';
import {
    getData,
    getStatistic,
    LS_EMPTY_DATA,
    LS_EMPTY_STATISTIC,
    LS_KEY,
    removeUrlGroupById,
    saveData,
    saveDataWithOptions,
    saveUrlGroup,
    updateStatistic,
} from 'src@/utils/localStorage';
import {UrlGroup} from 'src@/types/urlGroup';

type MemoryStorage = Record<string, string>;

let memoryStorage: MemoryStorage;

function installChromeStorageMock() {
    const local = {
        set: vi.fn((items: Record<string, string>, callback: () => void) => {
            Object.assign(memoryStorage, items);
            callback();
        }),
        get: vi.fn((keys: string[], callback: (result: MemoryStorage) => void) => {
            const result = keys.reduce<MemoryStorage>((values, key) => {
                if (key in memoryStorage) {
                    values[key] = memoryStorage[key];
                }
                return values;
            }, {});
            callback(result);
        }),
    };

    globalThis.chrome = {storage: {local}} as unknown as typeof chrome;
    return local;
}

const firstGroup: UrlGroup = {
    id: 'first',
    name: 'First',
    matches: ['first'],
    closeTimeout: 1000,
};

const secondGroup: UrlGroup = {
    id: 'second',
    name: 'Second',
    matches: ['second'],
    closeTimeout: 2000,
};

describe('local storage core', () => {
    beforeEach(() => {
        memoryStorage = {};
        installChromeStorageMock();
    });

    test('returns fallback data when a key is missing', async () => {
        const fallback = {groups: []};

        await expect(getLSData('missing', fallback)).resolves.toBe(fallback);
    });

    test('serializes saved data as JSON', async () => {
        await saveLSData('key', {value: 42});

        expect(memoryStorage.key).toBe('{"value":42}');
    });

    test('parses saved JSON', async () => {
        memoryStorage.key = '{"value":42}';

        await expect(getLSData('key')).resolves.toEqual({value: 42});
    });
});

describe('URL group storage', () => {
    beforeEach(() => {
        memoryStorage = {};
        installChromeStorageMock();
    });

    test('returns empty data when nothing has been saved', async () => {
        await expect(getData()).resolves.toEqual(LS_EMPTY_DATA);
    });

    test('saves a new group at the beginning', async () => {
        await saveData({groups: [firstGroup]});
        await saveUrlGroup(secondGroup);

        await expect(getData()).resolves.toEqual({groups: [secondGroup, firstGroup]});
    });

    test('updates an existing group without creating a duplicate', async () => {
        await saveData({groups: [firstGroup, secondGroup]});
        const changed = {...firstGroup, name: 'Changed'};

        await saveUrlGroup(changed);

        await expect(getData()).resolves.toEqual({groups: [changed, secondGroup]});
    });

    test('removes only the requested group', async () => {
        await saveData({groups: [firstGroup, secondGroup]});

        await removeUrlGroupById(firstGroup.id);

        await expect(getData()).resolves.toEqual({groups: [secondGroup]});
    });

    test('replaces existing groups when requested', async () => {
        await saveData({groups: [firstGroup]});

        await saveDataWithOptions({groups: [secondGroup]}, true);

        await expect(getData()).resolves.toEqual({groups: [secondGroup]});
    });

    test('appends imported groups when replacement is disabled', async () => {
        await saveData({groups: [firstGroup]});

        await saveDataWithOptions({groups: [secondGroup]}, false);

        await expect(getData()).resolves.toEqual({groups: [firstGroup, secondGroup]});
    });

    test('stores data under the extension storage key', async () => {
        await saveData({groups: [firstGroup]});

        expect(JSON.parse(memoryStorage[LS_KEY])).toEqual({groups: [firstGroup]});
    });
});

describe('statistics storage', () => {
    beforeEach(() => {
        memoryStorage = {};
        installChromeStorageMock();
        LS_EMPTY_STATISTIC.allClosed = 0;
    });

    test('returns zero when statistics have not been saved', async () => {
        await expect(getStatistic()).resolves.toEqual({allClosed: 0});
    });

    test('increments the number of closed tabs', async () => {
        await updateStatistic();
        await updateStatistic();

        await expect(getStatistic()).resolves.toEqual({allClosed: 2});
    });
});
