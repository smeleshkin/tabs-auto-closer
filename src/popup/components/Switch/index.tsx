import React, {useState} from 'react';
import { generateRandomString } from 'src@/utils/randomizer';

type Props = {
    label: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    checked: boolean,
}

const Switch = ({label, checked, onChange}: Props) => {
    const [elId] = useState(generateRandomString());

    return (
        <div className="form-check form-switch">
            <input
                className="form-check-input"
                type="checkbox"
                id={elId}
                checked={checked}
                onChange={onChange}
            />
            <label className="form-check-label" htmlFor={elId}>{label}</label>
        </div>
    );
};

export default Switch;

