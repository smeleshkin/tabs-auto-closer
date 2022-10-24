import React, {FormEventHandler} from 'react';

interface Props {
    value: string,
    onChange: FormEventHandler<HTMLTextAreaElement>,
}

export default function TextArea({value, onChange}: Props) {
    return (
        <textarea onChange={onChange} value={value} />
    )
}
