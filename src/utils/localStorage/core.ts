/// <reference types="chrome"/>

export function saveLSData(key: string, data: any): Promise<void> {
    return new Promise(resolve => {
        chrome.storage.local.set({[key]: JSON.stringify(data)}, () => {
            resolve();
        })
    })
}

export function getLSData(key: string, emptyData: any = null): Promise<any | null> {
    return new Promise(resolve => {
        chrome.storage.local.get([key], (result) => {
            const dataJSON = result[key];
            resolve(dataJSON ? JSON.parse(dataJSON) : emptyData);
        });
    })
}
