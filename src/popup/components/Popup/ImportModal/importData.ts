import validator from 'jsonschema';

import {ExportData, EXPORT_DATA_VERSIONS} from 'src@/popup/components/Popup/ExportModal/types';
import {SCHEMAS_BY_VERSION_MAP} from 'src@/popup/components/Popup/ExportModal/schemas';
import {LSData} from 'src@/utils/localStorage';
import {generateRandomString} from 'src@/utils/randomizer';

export class UnknownExportDataVersion extends Error {}

function castVersion(parsedJSON: any) {
    const version = parsedJSON?.version;
    if (version === EXPORT_DATA_VERSIONS.ALL_VERSION_1) {
        return parsedJSON as {version: EXPORT_DATA_VERSIONS.ALL_VERSION_1};
    }

    throw new UnknownExportDataVersion(`Unknown export data version: ${version}`);
}

export function parseExportedData(value: string): ExportData {
    const parsedJSON = JSON.parse(value.trim());
    const parsedDataWithCastedVersion = castVersion(parsedJSON);

    validator.validate(parsedJSON, SCHEMAS_BY_VERSION_MAP[parsedDataWithCastedVersion.version], {
        required: true,
        throwError: true,
    });

    return parsedJSON as ExportData;
}

export function addIdsToImportedData(
    exportedData: ExportData,
    createId: () => string = () => generateRandomString(16),
): LSData {
    return {
        ...exportedData.data,
        groups: exportedData.data.groups.map(group => ({
            ...group,
            id: createId(),
        })),
    };
}
