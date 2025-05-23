import {NewUrlGroup} from 'src@/types/urlGroup';

export enum EXPORT_DATA_VERSIONS {
    ALL_VERSION_1 = 'TabsAutoCloserExportV1',
}

export type ExportData = {
    version: EXPORT_DATA_VERSIONS,
    data: {
        groups: NewUrlGroup[],
    },
};