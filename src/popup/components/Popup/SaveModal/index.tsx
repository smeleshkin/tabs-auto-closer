import React, {useEffect, useRef, useState} from 'react';

import TextInput from 'src@/popup/components/TextInput';
import TextArea from 'src@/popup/components/TextArea';
import Button, {ButtonTypes} from 'src@/popup/components/Button';
import { saveUrlGroup } from 'src@/utils/localStorage';
import { generateRandomString } from 'src@/utils/randomizer';
import {UrlGroup} from 'src@/types/urlGroup';
import {findMatchedGroup} from 'src@/utils/findMatchedGroup';
import Alert, {AlertTypes} from 'src@/popup/components/Alert';

import './index.scss';

interface Props {
    onClose: () => void,
    selectedGroup?: UrlGroup
}

const TEXTAREA_PLACEHOLDER = [
    'Regular expressions on new lines. Example:',
    'https:\\/\\/telegram\\.me\\/(.)*',
    'https:\\/\\/t\\.me\\/joinchat\\/(.)*'
].join(`\n`);

export default function SaveModal({onClose, selectedGroup}: Props) {
    const [newItemTitle, setNewItemTitle] = useState<string>(selectedGroup? selectedGroup.name : '');
    const [newItemText, setNewItemText] = useState<string>(selectedGroup ? selectedGroup.matches.join(`\n`) : '');
    const [newItemTimeout, setNewItemTimeout] = useState<string>(selectedGroup ? String(selectedGroup.closeTimeout) : '');
    const [newItemId] = useState<string>(selectedGroup ? selectedGroup.id : generateRandomString(16));
    const titleInputRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

    const getChangedGroup = () => ({
        id: newItemId,
        name: newItemTitle,
        matches: newItemText.split(`\n`),
        closeTimeout: Number(newItemTimeout),
    });
    const onSave = () => {
        saveUrlGroup(getChangedGroup())
            .then(onClose);
    }
    const onInputTitleHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
        setNewItemTitle(e.target.value);
    }
    const onInputTextHandler: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
        setNewItemText(e.target.value);
    }

    const onInputTimeoutHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
        setNewItemTimeout(e.target.value);
    }

    /* Url checker start */
    const [{isMatch, urlForCheck}, setChecker] = useState({
        isMatch: false,
        urlForCheck: '',
    });
    const checkUrl = () => {
        const isMatch = Boolean(findMatchedGroup([getChangedGroup()], urlForCheck));
        setChecker({
            isMatch,
            urlForCheck,
        });
    }
    useEffect(() => {
        checkUrl();
    }, [urlForCheck, newItemText]);

    useEffect(() => {
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);
    /* Url checker end */

    return (
        <div>
            <TextInput
                inputRef={titleInputRef}
                value={newItemTitle}
                onChange={onInputTitleHandler}
                placeholder="Title"
            />
            <TextInput
                value={newItemTimeout}
                onChange={onInputTimeoutHandler}
                placeholder="Close timeout in ms"
            />
            <TextArea value={newItemText} onChange={onInputTextHandler} placeholder={TEXTAREA_PLACEHOLDER} />
            <div className="saveModalActionsBlock mb-2">
                <Button text="Save" callback={onSave} type={ButtonTypes.PRIMARY} />
                <Button text="Close" callback={onClose} />
            </div>
            <Alert type={isMatch ? AlertTypes.SUCCESS : AlertTypes.ERROR}>
                <>
                    <label className="form-label">Check your url:</label>
                    <div className="input-group">
                        <TextInput
                            value={urlForCheck}
                            onChange={e => setChecker({isMatch, urlForCheck: e.target.value})}
                            placeholder="Paste your url for check"
                            postfix={isMatch ? 'Matches!' : 'Does not match'}
                        />
                    </div>
                </>
            </Alert>
        </div>
    );
}
