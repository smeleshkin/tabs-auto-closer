import React from 'react';

interface Props {
    value: string,
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>,
    placeholder?: string,
    disabled?: boolean,
    rowsCount?: number,
}

export default function TextArea({value, onChange, placeholder, disabled, rowsCount}: Props) {
    return (
        <textarea
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            className="w-100"
            rows={rowsCount}
        />
    )
}
