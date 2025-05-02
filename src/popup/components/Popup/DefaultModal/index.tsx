import React from 'react';

import {UrlGroup} from 'src@/types/urlGroup';
import MenuItem from 'src@/popup/components/Popup/MenuItem';
import Button, {ButtonTypes} from 'src@/popup/components/Button';

import './index.scss';

interface Props {
    urlGroups: UrlGroup[],
    onRemoveClick: (id: string) => void,
    onEditClick: (id: string) => void,
    onCreateNewClick: () => void,
    onExportClick: () => void,
    onImportClick: () => void,
}

export default function DefaultModal({
    onRemoveClick,
    urlGroups,
    onEditClick,
    onCreateNewClick,
    onExportClick,
    onImportClick,
}: Props) {
    return (
        <div className="pasteModal">
            <div className="defaultModalActions">
                <Button text="New" callback={onCreateNewClick} type={ButtonTypes.SUCCESS} />
                <div className="defaultModalActionsBlock">
                    <Button text="Import" callback={onImportClick} />
                    {Boolean(urlGroups.length) && (<Button text="Export" callback={onExportClick} />)}
                </div>
            </div>
            {urlGroups.map((item, idx) => (
                <MenuItem
                    id={item.id}
                    title={item.name}
                    key={item.id}
                    shortcut={idx}
                    onRemoveClick={onRemoveClick}
                    onSelect={onEditClick}
                />)
            )}
        </div>
    );
}
