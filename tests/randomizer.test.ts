import {afterEach, describe, expect, test, vi} from 'vitest';

import {generateRandomString} from 'src@/utils/randomizer';

describe('generateRandomString', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('uses a default length of eight characters', () => {
        expect(generateRandomString()).toHaveLength(8);
    });

    test('uses the requested length', () => {
        expect(generateRandomString(16)).toHaveLength(16);
        expect(generateRandomString(0)).toBe('');
    });

    test('uses only alphanumeric characters', () => {
        expect(generateRandomString(1000)).toMatch(/^[A-Za-z0-9]+$/);
    });

    test('can be made deterministic by mocking Math.random', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        expect(generateRandomString(4)).toBe('AAAA');
    });
});
