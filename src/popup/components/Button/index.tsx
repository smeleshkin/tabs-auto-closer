import React from 'react';
import cn from 'classnames';

import './index.scss';

interface Props {
    text: string,
    callback: () => void,
    className?: string,
    title?: string,
}

export default function Button({text, callback, className, title}: Props) {
    const classes = cn('btn', 'btn-secondary', 'btn-sm', className);

    return (
        <button title={title} className={classes} onClick={callback}>{text}</button>
    );
}
