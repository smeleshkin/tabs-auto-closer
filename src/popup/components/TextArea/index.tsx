import React from 'react';

interface Props {
    value: string,
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>,
    placeholder?: string,
}

export default function TextArea({value, onChange, placeholder}: Props) {
    return (
        <textarea onChange={onChange} value={value} placeholder={placeholder} className="w-100" />
    )
}
