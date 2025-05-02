import React, { useState } from 'react';
import Switch from '.';

type Props = {
    initialValue?: boolean;
    label: string;
}

export const useSwitch = ({initialValue, label}: Props) => {
    const [checked, onSetChecked] = useState(initialValue || false);

    const onChange: React.ChangeEventHandler<HTMLInputElement> = e => onSetChecked(e.target.checked)

    const component = <Switch checked={checked} label={label} onChange={onChange} />;

    return {
        checked,
        component,
    };
}