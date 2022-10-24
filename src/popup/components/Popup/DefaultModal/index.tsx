import React from 'react';

import {UrlGroup} from 'src@/types/urlGroup';
import MenuItem from 'src@/popup/components/Popup/MenuItem';

import './index.scss';

interface Props {
    urlGroups: UrlGroup[],
    onRemoveClick: (id: string) => void,
    onEditClick: (id: string) => void
}

export default function DefaultModal({onRemoveClick, urlGroups, onEditClick}: Props) {

    return (
        <div className="pasteModal">
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
