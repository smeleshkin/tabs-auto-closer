import {UrlGroup} from 'src@/types/urlGroup';

export const findMatchedGroup = (urlGroups: UrlGroup[], url: string) => {
    const matches = (regexpAsString: string) => {
        try {
            return new RegExp(regexpAsString).test(url);
        } catch (_) {
            return false;
        }
    };

    return urlGroups.find(group => {
        const isMatch = group.matches.some(matches);
        const isExcluded = (group.excludeMatches ?? []).some(matches);

        return isMatch && !isExcluded;
    });
};
