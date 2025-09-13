import React, {useState} from 'react';
import validator  from 'jsonschema';

import Button, {ButtonTypes} from 'src@/popup/components/Button';
import TextArea from 'src@/popup/components/TextArea';
import {useSwitch} from 'src@/popup/components/Switch/useSwitch';
import {ExportData, EXPORT_DATA_VERSIONS} from 'src@/popup/components/Popup/ExportModal/types';
import {SCHEMAS_BY_VERSION_MAP} from 'src@/popup/components/Popup/ExportModal/schemas';
import {generateRandomString} from 'src@/utils/randomizer';

import Alert, {AlertTypes, Props as AlertProps} from 'src@/popup/components/Alert';
import {LSData, saveDataWithOptions} from 'src@/utils/localStorage';

import './index.scss';

interface Props {
    onClose: () => void,
}

class UnknownExportDataVersion extends Error {}

const custVersion = (parsedJSON: any) => {
    const version = parsedJSON?.version;
    if (version === EXPORT_DATA_VERSIONS.ALL_VERSION_1) {
        return parsedJSON as {version: EXPORT_DATA_VERSIONS.ALL_VERSION_1};
    }

    throw new UnknownExportDataVersion(`Unknown export data version: ${version}`);
}

const parseExportedData = (value: string): ExportData => {
    const parsedJSON = JSON.parse(value.trim());
    const parsedDataWithCustedVersion = custVersion(parsedJSON);

    validator.validate(parsedJSON, SCHEMAS_BY_VERSION_MAP[parsedDataWithCustedVersion.version], {
        required: true,
        throwError: true,
    });
    
    return parsedJSON as ExportData;
}

export default function ImportModal({onClose}: Props) {
    const [state, setState] = useState<string>('');
    const [message, setMessage] = useState<{type: AlertTypes, text: string} | null>(null);
    const onChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
        setMessage(null);
        setState(e.target.value);
    }

    const {component: switchComponent, checked: isReplaceData} = useSwitch({
        label: 'Replace current data',
    });

    const onImportClick = () => {
        try {
            const parsedValue = parseExportedData(state);
            const dataWithIds: LSData = {
                ...parsedValue.data,
                groups: parsedValue.data.groups.map(group => ({
                    ...group,
                    id: generateRandomString(16),
                })),
            }

            saveDataWithOptions(dataWithIds, isReplaceData)
                .then(() => {
                    setMessage({
                        type: AlertTypes.SUCCESS,
                        text: 'Success!',
                    });
                })
                .catch(e => {
                    setMessage({
                        type: AlertTypes.ERROR,
                        text: `Error: ${(e as Error).message}`,
                    });
                });
        } catch (e) {
            setMessage({
                type: AlertTypes.ERROR,
                text: `Error: ${(e as Error).message}`,
            });
        }
    }

    return (
        <div className="exportModal">
            <div>
                <label>Paste exported data here:</label>
            </div>
            <div>
                <TextArea onChange={onChangeHandler} value={state} rowsCount={10} />
            </div>
            {switchComponent}
            {message !== null && <Alert type={message.type}>{message.text}</Alert>}
            <div className="importModalActionsBlock">
                <Button text="Import" callback={onImportClick} type={ButtonTypes.PRIMARY} />
                <Button text="Close" callback={onClose} />
            </div>
        </div>
    );
}
