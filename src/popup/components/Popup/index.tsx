import React, {useEffect, useState} from 'react';

import {LS_EMPTY_DATA, LSData, getData, removeUrlGroupById} from 'src@/utils/localStorage';
import {UrlGroup} from 'src@/types/urlGroup';
import Button from 'src@/popup/components/Button';

import SaveModal from './SaveModal';
import ConfirmModal from './ConfirmModal';
import DefaultModal from './DefaultModal';

import './index.scss';

enum POPUP_MODES {
    DEFAULT = 'DEFAULT',
    URL_GROUP_EDIT = 'URL_GROUP_EDIT',
    CREATE_NEW = 'CREATE_NEW',
    CONFIRM_REMOVE = 'CONFIRM_REMOVE',
}

function isThisMode(currentMode: POPUP_MODES, mode: POPUP_MODES) {
    return mode === currentMode;
}
function isConfirmRemoveMode(mode: POPUP_MODES) {
    return mode === POPUP_MODES.CONFIRM_REMOVE;
}

export default function Popup() {
    const [mode, setMode] = useState<POPUP_MODES>(POPUP_MODES.DEFAULT);
    const [state, setState] = useState<LSData>(LS_EMPTY_DATA);
    const [selectedGroup, setSelectedGroup] = useState<UrlGroup | undefined>();

    const onEditGroupById = (id: UrlGroup['id']) => {
        const group = state.groups.find(group => group.id === id);
        if (group) {
            setSelectedGroup(group);
            setMode(POPUP_MODES.URL_GROUP_EDIT);
        }
    }

    const reloadState = () => {
        getData()
            .then((result) => {
                if (result) {
                    setState(result);
                }
            });
    };

    useEffect(() => {
        reloadState()
    }, []);

    const [idForRemove, setIdForRemove] = useState<UrlGroup['id'] | null>(null);

    const onRemoveClick = (id: UrlGroup['id']) => {
        setIdForRemove(id);
        setMode(POPUP_MODES.CONFIRM_REMOVE);
    }

    const onRemoveApprove = async () => {
        if (idForRemove) {
            await removeUrlGroupById(idForRemove);
        }
        await reloadState();
        setMode(POPUP_MODES.DEFAULT);
    }

    return (
        <div className="popup">
            {isThisMode(mode, POPUP_MODES.DEFAULT) && (
                <>
                    <div className="actions">
                        <Button text="New" callback={() => setMode(POPUP_MODES.CREATE_NEW)} />
                    </div>
                    <DefaultModal
                        onRemoveClick={onRemoveClick}
                        urlGroups={state.groups}
                        onEditClick={onEditGroupById}
                    />
                </>
            )}
            {isThisMode(mode, POPUP_MODES.CREATE_NEW) && (
                <SaveModal onClose={() => {
                    setMode(POPUP_MODES.DEFAULT);
                    reloadState();
                }} />
            )}
            {isThisMode(mode, POPUP_MODES.URL_GROUP_EDIT) && (
                <SaveModal
                    onClose={() => {
                        setMode(POPUP_MODES.DEFAULT);
                        reloadState();
                    }}
                    selectedGroup={selectedGroup}
                />
            )}
            {isConfirmRemoveMode(mode) && (
                <ConfirmModal
                    title="Remove?"
                    onApprove={onRemoveApprove}
                    onCancel={() => setMode(POPUP_MODES.DEFAULT)}
                />
            )}
        </div>
    );
}
