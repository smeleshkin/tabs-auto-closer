import React from "react";
import cn from 'classnames';

export enum AlertTypes {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export type Props = {
    children: string | JSX.Element;
    type: AlertTypes,
};

const ALERT_TYPE_TO_CLASS_MAP: Record<AlertTypes, string> = {
    [AlertTypes.SUCCESS]: 'alert-success',
    [AlertTypes.ERROR]: 'alert-danger',
};

const Alert = ({type, children}: Props) => {
    return (
        <div
            className={cn('alert', ALERT_TYPE_TO_CLASS_MAP[type])}
            role="alert"
        >
            {children}
        </div>
    );
}

export default Alert;