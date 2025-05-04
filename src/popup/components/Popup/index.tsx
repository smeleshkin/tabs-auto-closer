import React, {useEffect, useState} from 'react';

import {
    LS_EMPTY_DATA,
    LSData,
    getData,
    removeUrlGroupById,
    LS_EMPTY_STATISTIC,
    getStatistic,
    Statistic,
} from 'src@/utils/localStorage';
import {UrlGroup} from 'src@/types/urlGroup';

import SaveModal from './SaveModal';
import ConfirmModal from './ConfirmModal';
import DefaultModal from './DefaultModal';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';

import './index.scss';

enum POPUP_MODES {
    DEFAULT = 'DEFAULT',
    URL_GROUP_EDIT = 'URL_GROUP_EDIT',
    CREATE_NEW = 'CREATE_NEW',
    CONFIRM_REMOVE = 'CONFIRM_REMOVE',
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT'
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

    const [statistic, setStatistic] = useState<Statistic>(LS_EMPTY_STATISTIC);

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
        getStatistic()
            .then(result => {
                if (result) {
                    setStatistic(result);
                }
            })
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

    const onGoToMainPage = () => {
        setMode(POPUP_MODES.DEFAULT);
        reloadState();
    }

    return (
        <div className="popup">
            {isThisMode(mode, POPUP_MODES.DEFAULT) && (
                <DefaultModal
                    onRemoveClick={onRemoveClick}
                    onEditClick={onEditGroupById}
                    onCreateNewClick={() => setMode(POPUP_MODES.CREATE_NEW)}
                    onExportClick={() => setMode(POPUP_MODES.EXPORT)}
                    onImportClick={() => setMode(POPUP_MODES.IMPORT)}
                    urlGroups={state.groups}
                    statistic={statistic}
                />
            )}
            {isThisMode(mode, POPUP_MODES.CREATE_NEW) && (
                <SaveModal onClose={onGoToMainPage} />
            )}
            {isThisMode(mode, POPUP_MODES.URL_GROUP_EDIT) && (
                <SaveModal
                    onClose={onGoToMainPage}
                    selectedGroup={selectedGroup}
                />
            )}
            {isConfirmRemoveMode(mode) && (
                <ConfirmModal
                    title="Remove?"
                    onApprove={onRemoveApprove}
                    onCancel={onGoToMainPage}
                />
            )}
            {isThisMode(mode, POPUP_MODES.EXPORT) && (
                <ExportModal onClose={onGoToMainPage} />
            )}
            {isThisMode(mode, POPUP_MODES.IMPORT) && (
                <ImportModal onClose={onGoToMainPage} />
            )}
        </div>
    );
}
