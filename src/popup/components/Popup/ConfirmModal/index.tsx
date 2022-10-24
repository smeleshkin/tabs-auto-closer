import React, {useEffect} from 'react';

import Button from 'src@/popup/components/Button';

import './index.scss';

interface Props {
    title: string
    onCancel: () => void,
    onApprove: () => void,
}

export default function ConfirmModal({title, onCancel, onApprove}: Props) {
    const shortcutHandler = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'y') {
            onApprove();
        }
        if (e.key.toLowerCase() === 'n') {
            onCancel();
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', shortcutHandler);

        return () => document.removeEventListener('keyup', shortcutHandler);
    }, [shortcutHandler])
    return (
        <div>
            <div>{title}</div>
            <div>
                <Button text="Confirm [Y]" className="confirmModalRightMargin" callback={onApprove} />
                <Button text="Cancel [N]" callback={onCancel} />
            </div>
        </div>
    );
}
