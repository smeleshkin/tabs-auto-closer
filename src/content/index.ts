import {createTabWasOpenMessage } from 'src@/messageEvents';

chrome.runtime.sendMessage(
    createTabWasOpenMessage(window.location.href)
);


