import React from 'react';

interface Props {
    value: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    inputRef?: React.MutableRefObject<HTMLInputElement>,
    placeholder?: string
}

export default function TextInput({value, onChange, inputRef, placeholder}: Props) {
    return (
        <input
            type="text"
            ref={inputRef}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            className="w-100"
        />
    );
}
