import React, {useState} from 'react';

import Button, {ButtonTypes} from 'src@/popup/components/Button';
import TextArea from 'src@/popup/components/TextArea';
import {useSwitch} from 'src@/popup/components/Switch/useSwitch';

import Alert, {AlertTypes} from 'src@/popup/components/Alert';
import {saveDataWithOptions} from 'src@/utils/localStorage';

import {addIdsToImportedData, parseExportedData} from './importData';
import './index.scss';

interface Props {
    onClose: () => void,
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
            const dataWithIds = addIdsToImportedData(parsedValue);

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
