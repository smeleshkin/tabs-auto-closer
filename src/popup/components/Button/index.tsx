import React from 'react';
import cn from 'classnames';

import './index.scss';

export enum ButtonTypes {
    PRIMARY = 'primary',
    DANGER = 'danger',
    SUCCESS = 'success',
    SECONDARY = 'secondary',
}

interface Props {
    text: string,
    callback: () => void,
    className?: string,
    title?: string,
    type?: ButtonTypes,
}

const BUTTON_TYPE_TO_CLASS_MAP: Record<ButtonTypes, string> = {
    [ButtonTypes.PRIMARY]: 'btn-primary',
    [ButtonTypes.DANGER]: 'btn-danger',
    [ButtonTypes.SUCCESS]: 'btn-success',
    [ButtonTypes.SECONDARY]: 'btn-secondary',
}

export default function Button({text, callback, className, title, type = ButtonTypes.SECONDARY}: Props) {
    const classNames = cn('btn', 'btn-sm', className, BUTTON_TYPE_TO_CLASS_MAP[type]);

    return (
        <button title={title} className={classNames} onClick={callback}>{text}</button>
    );
}
