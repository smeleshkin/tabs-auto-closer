import {describe, expect, test} from 'vitest';

import {
    addIdsToImportedData,
    parseExportedData,
    UnknownExportDataVersion,
} from 'src@/popup/components/Popup/ImportModal/importData';
import {createExportData} from 'src@/popup/components/Popup/ExportModal/exportData';
import {EXPORT_DATA_VERSIONS} from 'src@/popup/components/Popup/ExportModal/types';

const storedData = {
    groups: [
        {
            id: 'internal-id',
            name: 'Telegram',
            matches: ['https:\\/\\/t\\.me\\/(.)*'],
            closeTimeout: 1000,
        },
    ],
};

describe('export data', () => {
    test('adds the format version and removes internal group IDs', () => {
        expect(createExportData(storedData)).toEqual({
            version: EXPORT_DATA_VERSIONS.ALL_VERSION_1,
            data: {
                groups: [{
                    name: 'Telegram',
                    matches: ['https:\\/\\/t\\.me\\/(.)*'],
                    closeTimeout: 1000,
                }],
            },
        });
    });

    test('does not mutate stored data', () => {
        createExportData(storedData);

        expect(storedData.groups[0].id).toBe('internal-id');
    });
});

describe('import data', () => {
    const exportedData = createExportData(storedData);

    test('parses and validates exported JSON', () => {
        expect(parseExportedData(`  ${JSON.stringify(exportedData)}  `)).toEqual(exportedData);
    });

    test('rejects malformed JSON', () => {
        expect(() => parseExportedData('{')).toThrow(SyntaxError);
    });

    test('rejects an unknown format version', () => {
        const value = JSON.stringify({...exportedData, version: 'future-version'});

        expect(() => parseExportedData(value)).toThrow(UnknownExportDataVersion);
    });

    test.each([
        {version: EXPORT_DATA_VERSIONS.ALL_VERSION_1},
        {version: EXPORT_DATA_VERSIONS.ALL_VERSION_1, data: {}},
        {
            version: EXPORT_DATA_VERSIONS.ALL_VERSION_1,
            data: {groups: [{name: 'Missing fields'}]},
        },
        {
            version: EXPORT_DATA_VERSIONS.ALL_VERSION_1,
            data: {groups: [{name: 'Wrong timeout', matches: [], closeTimeout: '1000'}]},
        },
    ])('rejects data that does not match the schema: %o', value => {
        expect(() => parseExportedData(JSON.stringify(value))).toThrow();
    });

    test('assigns a fresh ID to every imported group', () => {
        const twoGroups = {
            ...exportedData,
            data: {groups: [...exportedData.data.groups, ...exportedData.data.groups]},
        };
        const ids = ['first-id', 'second-id'];

        expect(addIdsToImportedData(twoGroups, () => ids.shift() as string)).toEqual({
            groups: [
                {...exportedData.data.groups[0], id: 'first-id'},
                {...exportedData.data.groups[0], id: 'second-id'},
            ],
        });
    });

    test('supports an export-import round trip', () => {
        const parsed = parseExportedData(JSON.stringify(createExportData(storedData)));

        expect(addIdsToImportedData(parsed, () => 'new-id')).toEqual({
            groups: [{...storedData.groups[0], id: 'new-id'}],
        });
    });
});
