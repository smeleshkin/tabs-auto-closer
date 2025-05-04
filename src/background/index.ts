/// <reference types="chrome"/>

import {MESSAGE_EVENTS, MessageTypes} from 'src@/messageEvents';
import {getData, updateStatistic} from 'src@/utils/localStorage';
import {UrlGroup} from 'src@/types/urlGroup';

const findMatchedGroup = (urlGroups: UrlGroup[], url: string) => {
    return urlGroups.find(group => {
        return group.matches.some(regexpAsString => new RegExp(regexpAsString).test(url));
    });
};

const ICONS = {
    DEFAULT: '/icons/broom128.png',
    ACTION: '/icons/broom128timer.png',
};

const timeouts: Record<string, NodeJS.Timeout> = {};

const setIcon = (tabId: number, iconPath: string) => {
    const params = {
        tabId,
        path: iconPath
    };
    if (chrome.action) {
        chrome.action.setIcon(params)
    }
    if (chrome.pageAction) {
        chrome.action.setIcon(params)
    }
};

chrome.runtime.onMessage.addListener(
    async function (message: MessageTypes, sender) {
        if (message.type === MESSAGE_EVENTS.TAB_WAS_OPEN) {
            const tabId = sender.tab?.id;
            if (!tabId) {
                return;
            }

            const {groups} = await getData();
            const matchedGroup = findMatchedGroup(groups, message.url);

            if (matchedGroup) {
                setIcon(tabId, ICONS.ACTION);

                const timeoutId = setTimeout(async () =>  {
                    try {
                        await chrome.tabs.remove(tabId);
                        await updateStatistic();
                    } catch (e) {
                        console.warn(`Error in remove tab with id "${tabId}": ${String(e)}`);
                    }
                }, matchedGroup.closeTimeout);
                timeouts[String(tabId)] = timeoutId;
            } else {
                const timeoutId = timeouts[String(tabId)];
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    delete timeouts[String(tabId)];
                    setIcon(tabId, ICONS.DEFAULT);
                }
            }
        }
    }
);
