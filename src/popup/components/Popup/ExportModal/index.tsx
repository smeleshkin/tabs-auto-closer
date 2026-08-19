import React, {useEffect, useState} from 'react';

import Button from 'src@/popup/components/Button';
import TextArea from 'src@/popup/components/TextArea';
import {LS_EMPTY_DATA, getData} from 'src@/utils/localStorage';

import {ExportData} from './types';
import {createExportData} from './exportData';
import './index.scss';

interface Props {
    onClose: () => void,
}

export default function ExportModal({onClose}: Props) {
    const [state, setState] = useState<ExportData>(createExportData(LS_EMPTY_DATA));
    useEffect(() => {
        getData()
            .then(result => setState(createExportData(result)));
    }, []);

    return (
        <div className="exportModal">
            <div>
                <label>Copy this:</label>
            </div>
            <div>
                <TextArea value={JSON.stringify(state, null, 2)} disabled rowsCount={10} />
            </div>
            <div>
                <Button text="Close" callback={onClose} />
            </div>
        </div>
    );
}
