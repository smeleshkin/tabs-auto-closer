import React, {FormEventHandler, MutableRefObject} from 'react';

interface Props {
    value: string,
    onChange: FormEventHandler<HTMLInputElement>,
    inputRef?: MutableRefObject<HTMLInputElement | undefined>,
    placeholder?: string
}

export default function TextInput({value, onChange, inputRef, placeholder}: Props) {
    // @ts-ignore
    return <input type="text" ref={inputRef} onChange={onChange} value={value} placeholder={placeholder} />;
}
