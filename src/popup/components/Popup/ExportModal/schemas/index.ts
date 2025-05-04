import {Schema}  from 'jsonschema';
import {EXPORT_DATA_VERSIONS} from 'src@/popup/components/Popup/ExportModal/types';
import {EXPORT_SCHEMA_V1} from './tabsAutoCloserExportV1';

export const SCHEMAS_BY_VERSION_MAP: Record<EXPORT_DATA_VERSIONS, Schema> = {
    [EXPORT_DATA_VERSIONS.ALL_VERSION_1]: EXPORT_SCHEMA_V1,
};
