import {LSData} from 'src@/utils/localStorage';

import {ExportData, EXPORT_DATA_VERSIONS} from './types';

export function createExportData(localStorageData: LSData): ExportData {
    return {
        version: EXPORT_DATA_VERSIONS.ALL_VERSION_1,
        data: {
            ...localStorageData,
            groups: localStorageData.groups.map(({id, ...rest}) => ({...rest})),
        },
    };
}
