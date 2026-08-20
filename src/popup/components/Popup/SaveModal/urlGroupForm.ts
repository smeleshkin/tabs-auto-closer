import {UrlGroup} from 'src@/types/urlGroup';
import {findMatchedGroup} from 'src@/utils/findMatchedGroup';

export type UrlGroupFormValues = {
    id: string;
    title: string;
    matches: string;
    excludeMatches: string;
    timeout: string;
};

export function createUrlGroupFromForm({
    id,
    title,
    matches,
    excludeMatches,
    timeout,
}: UrlGroupFormValues): UrlGroup {
    return {
        id,
        name: title,
        matches: matches.split(`\n`),
        excludeMatches: excludeMatches
            .split(`\n`)
            .filter(regexp => regexp.length > 0),
        closeTimeout: Number(timeout),
    };
}

export function doesUrlGroupMatch(group: UrlGroup, url: string): boolean {
    return Boolean(findMatchedGroup([group], url));
}
