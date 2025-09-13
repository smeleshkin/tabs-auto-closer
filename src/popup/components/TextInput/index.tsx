import React from 'react';

interface Props {
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    inputRef?: React.MutableRefObject<HTMLInputElement>,
    placeholder?: string,
    postfix?: string,
}

export default function TextInput({value, onChange, inputRef, placeholder, postfix}: Props) {
    return (
        <div className="input-group mb-2">
            <input
                type="text"
                ref={inputRef}
                onChange={onChange}
                value={value}
                placeholder={placeholder}
                className="form-control"
            />
            {postfix && <span className="input-group-text">{postfix}</span>}
        </div>
    );
}
