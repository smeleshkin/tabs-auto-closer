/// <reference types="chrome"/>

import {getData, updateStatistic} from 'src@/utils/localStorage';
import {createTabUpdatedHandler} from './tabUpdatedHandler';

const ICONS = {
    DEFAULT: '/icons/broom128.png',
    ACTION: '/icons/broom128timer.png',
};

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

chrome.tabs.onUpdated.addListener(createTabUpdatedHandler({
    getData,
    removeTab: tabId => chrome.tabs.remove(tabId),
    updateStatistic,
    setIcon,
    setTimer: (callback, timeout) => setTimeout(callback, timeout),
    clearTimer: timeout => clearTimeout(timeout),
    defaultIcon: ICONS.DEFAULT,
    actionIcon: ICONS.ACTION,
    warn: message => console.warn(message),
}));
