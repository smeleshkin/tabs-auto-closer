/// <reference types="chrome"/>

import { UrlGroup} from 'src@/types/urlGroup';
import { getLSData, saveLSData } from './core';

export type LSData = {
    groups: UrlGroup[],
}
export const LS_KEY = 'tab-closer'
export const LS_EMPTY_DATA: LSData = {
    groups: [],
};


export function getData(): Promise<LSData> {
    return getLSData(LS_KEY, LS_EMPTY_DATA);
}

function saveData(data: LSData): Promise<void> {
    return saveLSData(LS_KEY, data);
}

export async function saveUrlGroup(newItem: UrlGroup) {
    const currentData = await getData();
    const newData = {
        ...currentData,
        groups: [
            {
                ...newItem,
            },
            ...currentData.groups.filter(group => group.id !== newItem.id),
        ],
    }
    await saveData(newData);
}

export async function removeUrlGroupById(idForRemove: UrlGroup['id']): Promise<void> {
    return new Promise(async (resolve) => {
        const data = await getData();
        const newData = {
            groups: data.groups.filter(({id}) => id !== idForRemove),
        };
        await saveData(newData);
        resolve()
    })
}
