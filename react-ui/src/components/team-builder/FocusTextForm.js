import React, { useEffect, useState, useRef } from 'react';

export default function FocusTextForm(props) {
    const inputRef = useRef();
    const [value, setValue] = useState(props.value || '');

    useEffect(() => {
        if (props.showForm) inputRef.current.focus();
        else setValue('');
    }, [props.showForm]);

    const handleOnChange = (e) => {
        setValue(e.target.value);
    };

    return (
            <input
                className="focus-text-box"
                ref={inputRef}
                type='text'
                value={value}
                onChange={handleOnChange || null}
                placeholder={props.placeholderValue || null}
                onKeyDown={props.handleOnKeyDown || null}
                onBlur={props.handleOnBlur || null}
            />
    )
}