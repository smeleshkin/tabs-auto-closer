import React, {useEffect} from 'react';

import Button, {ButtonTypes} from 'src@/popup/components/Button';

import './index.scss';

interface Props {
    title: string;
    id: string,
    shortcut: number,
    onRemoveClick: (id: string) => void,
    onSelect: (id: string) => void,
}

export default function MenuItem({title, shortcut, onRemoveClick, onSelect, id}: Props) {

    const shortcutHandler = (e: KeyboardEvent) => {
        if (e.key === shortcut.toString()) {
            onSelect(id);
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', shortcutHandler);

        return () => document.removeEventListener('keyup', shortcutHandler);
    }, [shortcutHandler])


    return (
        <li className="list-group-item">
            <div className="menuItem">
                <div>[{shortcut}] {title}</div>
                <div>
                    <Button text="[E]" title="Edit" className="menuItemButton" callback={() => onSelect(id)} type={ButtonTypes.PRIMARY} />
                    <Button text="[X]" title="Remove" callback={() => onRemoveClick(id)} type={ButtonTypes.DANGER} />
                </div>
            </div>
        </li>
    );
}
