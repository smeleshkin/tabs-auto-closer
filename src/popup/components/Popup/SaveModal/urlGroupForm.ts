import {UrlGroup} from 'src@/types/urlGroup';
import {findMatchedGroup} from 'src@/utils/findMatchedGroup';

export type UrlGroupFormValues = {
    id: string;
    title: string;
    matches: string;
    timeout: string;
};

export function createUrlGroupFromForm({
    id,
    title,
    matches,
    timeout,
}: UrlGroupFormValues): UrlGroup {
    return {
        id,
        name: title,
        matches: matches.split(`\n`),
        closeTimeout: Number(timeout),
    };
}

export function doesUrlGroupMatch(group: UrlGroup, url: string): boolean {
    return Boolean(findMatchedGroup([group], url));
}
