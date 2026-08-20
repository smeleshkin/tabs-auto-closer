import {describe, expect, test} from 'vitest';

import {findMatchedGroup} from 'src@/utils/findMatchedGroup';
import {UrlGroup} from 'src@/types/urlGroup';

const groups: UrlGroup[] = [
    {
        id: 'telegram',
        name: 'Telegram',
        matches: ['https:\\/\\/t\\.me\\/(.)*', 'https:\\/\\/telegram\\.me\\/(.)*'],
        closeTimeout: 1000,
    },
    {
        id: 'zoom',
        name: 'Zoom',
        matches: ['https:\\/\\/(.)*\\.zoom\\.us\\/j\\/(.)*'],
        closeTimeout: 2000,
    },
];

describe('findMatchedGroup', () => {
    test('returns the group containing a matching expression', () => {
        expect(findMatchedGroup(groups, 'https://t.me/joinchat/example')).toBe(groups[0]);
        expect(findMatchedGroup(groups, 'https://company.zoom.us/j/123')).toBe(groups[1]);
    });

    test('checks all expressions in a group', () => {
        expect(findMatchedGroup(groups, 'https://telegram.me/example')).toBe(groups[0]);
    });

    test('returns the first matching group', () => {
        const matchAll = {...groups[0], id: 'all', matches: ['https://']};

        expect(findMatchedGroup([matchAll, ...groups], 'https://t.me/example')).toBe(matchAll);
    });

    test('returns undefined when no expression matches', () => {
        expect(findMatchedGroup(groups, 'https://example.com')).toBeUndefined();
    });

    test('does not return a group when an exclude expression matches', () => {
        const groupWithExclude = {...groups[0], excludeMatches: ['joinchat']};

        expect(findMatchedGroup([groupWithExclude], 'https://t.me/joinchat/example')).toBeUndefined();
        expect(findMatchedGroup([groupWithExclude], 'https://t.me/example')).toBe(groupWithExclude);
    });

    test('continues looking for another group after an excluded match', () => {
        const excludedGroup = {...groups[0], excludeMatches: ['joinchat']};
        const fallbackGroup = {...groups[0], id: 'fallback'};

        expect(findMatchedGroup(
            [excludedGroup, fallbackGroup],
            'https://t.me/joinchat/example',
        )).toBe(fallbackGroup);
    });

    test('returns undefined for an empty group list', () => {
        expect(findMatchedGroup([], 'https://t.me/example')).toBeUndefined();
    });

    test('does not throw for an invalid regular expression', () => {
        const invalidGroup = {...groups[0], matches: ['[']};

        expect(() => findMatchedGroup([invalidGroup], 'https://t.me/example')).not.toThrow();
        expect(findMatchedGroup([invalidGroup], 'https://t.me/example')).toBeUndefined();
    });

    test('ignores an invalid exclude regular expression', () => {
        const invalidExcludeGroup = {...groups[0], excludeMatches: ['[']};

        expect(findMatchedGroup([invalidExcludeGroup], 'https://t.me/example')).toBe(invalidExcludeGroup);
    });
});
