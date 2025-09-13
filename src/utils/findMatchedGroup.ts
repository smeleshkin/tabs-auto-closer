import {UrlGroup} from 'src@/types/urlGroup';

export const findMatchedGroup = (urlGroups: UrlGroup[], url: string) => {
    return urlGroups.find(group => {
        return group.matches.some(regexpAsString => new RegExp(regexpAsString).test(url));
    });
};