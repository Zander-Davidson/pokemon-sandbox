import React, { useEffect, useState, useRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useSelector } from 'react-redux';

export default function FocusTypeahead(props) {
    const inputRef = useRef();
    const [value, setValue] = useState(props.value || '');

    useEffect(() => {
        if (props.showForm) inputRef.current.focus();
        else setValue('');
    }, [props.showForm]);

    const handleOnChange = (e) => {
        setValue(e);
    };

    const handleOnKeyDown = (e) => {
        if (props.options.includes(e.target.value)) {
            props.handleOnKeyDown(e);
        }
    };

    return (
        <Typeahead
            ref={inputRef}
            id={"focusTypeahead"}
            size="small"
            clearButton
            options={props.options}
            selected={value}
            placeholder={props.placeholderValue || null}
            onChange={handleOnChange || null}
            onKeyDown={handleOnKeyDown || null}
            onBlur={props.handleOnBlur || null}
        />
    )
}