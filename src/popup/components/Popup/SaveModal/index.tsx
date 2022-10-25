import React, {useEffect, useRef, useState} from 'react';

import TextInput from 'src@/popup/components/TextInput';
import TextArea from 'src@/popup/components/TextArea';
import Button from 'src@/popup/components/Button';
import { saveUrlGroup } from 'src@/utils/localStorage';
import { generateRandomString } from 'src@/utils/randomizer';
import {UrlGroup} from 'src@/types/urlGroup';

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

    const onSave = () => {
        saveUrlGroup({
            id: newItemId,
            name: newItemTitle,
            matches: newItemText.split(`\n`),
            closeTimeout: Number(newItemTimeout),
        })
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

    useEffect(() => {
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, []);



    return (
        <div>
            <div className="mb-1">
                <TextInput
                    inputRef={titleInputRef}
                    value={newItemTitle}
                    onChange={onInputTitleHandler}
                    placeholder="Title"
                />
            </div>
            <div className="mb-1">
                <TextInput
                    value={newItemTimeout}
                    onChange={onInputTimeoutHandler}
                    placeholder="Close timeout"
                />
            </div>
            <TextArea value={newItemText} onChange={onInputTextHandler} placeholder={TEXTAREA_PLACEHOLDER} />
            <div>
                <Button text="Save" className="saveModalButtonRightMargin" callback={onSave} />
                <Button text="Close" callback={onClose} />
            </div>
        </div>
    );
}
