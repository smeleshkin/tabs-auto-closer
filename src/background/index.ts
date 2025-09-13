/// <reference types="chrome"/>

import {getData, updateStatistic} from 'src@/utils/localStorage';
import {findMatchedGroup} from 'src@/utils/findMatchedGroup';

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

chrome.tabs.onUpdated.addListener(async (tabId, changes, tab) => {
    if (tab.status === 'complete' && tab.url) {
        const {groups} = await getData();
        const matchedGroup = findMatchedGroup(groups, tab.url);

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
});
