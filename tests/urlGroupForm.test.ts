import {describe, expect, test} from 'vitest';

import {
    createUrlGroupFromForm,
    doesUrlGroupMatch,
} from 'src@/popup/components/Popup/SaveModal/urlGroupForm';

describe('URL group form', () => {
    test('converts form strings to a URL group', () => {
        expect(createUrlGroupFromForm({
            id: 'group-id',
            title: 'Meetings',
            matches: 'zoom\\.us\nmeet\\.google\\.com',
            excludeMatches: 'zoom\\.us/keep\nmeet\\.google\\.com/important',
            timeout: '2500',
        })).toEqual({
            id: 'group-id',
            name: 'Meetings',
            matches: ['zoom\\.us', 'meet\\.google\\.com'],
            excludeMatches: ['zoom\\.us/keep', 'meet\\.google\\.com/important'],
            closeTimeout: 2500,
        });
    });

    test('preserves the current conversion semantics for an empty timeout', () => {
        expect(createUrlGroupFromForm({
            id: 'id',
            title: '',
            matches: '',
            excludeMatches: '',
            timeout: '',
        })).toEqual({
            id: 'id',
            name: '',
            matches: [''],
            excludeMatches: [],
            closeTimeout: 0,
        });
    });

    test('checks a URL against the converted group', () => {
        const group = createUrlGroupFromForm({
            id: 'group-id',
            title: 'Telegram',
            matches: 'https:\\/\\/t\\.me\\/(.)*',
            excludeMatches: 'joinchat',
            timeout: '1000',
        });

        expect(doesUrlGroupMatch(group, 'https://t.me/example')).toBe(true);
        expect(doesUrlGroupMatch(group, 'https://t.me/joinchat/example')).toBe(false);
        expect(doesUrlGroupMatch(group, 'https://example.com')).toBe(false);
    });
});
