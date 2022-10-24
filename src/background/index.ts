/// <reference types="chrome"/>

import {MESSAGE_EVENTS, MessageTypes} from 'src@/messageEvents';
import {getData} from 'src@/utils/localStorage';
import {UrlGroup} from 'src@/types/urlGroup';

const findMatchedGroup = (urlGroups: UrlGroup[], url: string) => {
    return urlGroups.find(group => {
        return group.matches.some(regexpAsString => new RegExp(regexpAsString).test(url));
    })
}

chrome.runtime.onMessage.addListener(
    async function (message: MessageTypes, sender) {
        if (message.type === MESSAGE_EVENTS.TAB_WAS_OPEN) {
            const {groups} = await getData();

            const matchedGroup = findMatchedGroup(groups, message.url);
            if (matchedGroup) {
                setTimeout(() =>  {
                    const tabId = sender.tab?.id;
                    if (tabId) {
                        chrome.tabs.remove(tabId)
                    }
                }, matchedGroup.closeTimeout);
            }
        }
    }
);
