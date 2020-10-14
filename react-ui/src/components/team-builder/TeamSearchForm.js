import { faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useRef } from 'react';
import { SortAmountUp, SortAmountDownAlt } from '../icons/FAIcons';

export default function TeamSearchForm(props) {
    const inputRef = useRef();
    const [value, setValue] = useState(props.value);

    useEffect(() => {
        if (props.showForm) inputRef.current.focus();
        else setValue('');
    }, [props.showForm]);

    const handleOnChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <div>
            <form>
                <input
                    className="focus-text-box"
                    ref={inputRef}
                    type='text'
                    value={value}
                    onChange={handleOnChange}
                    placeholder={props.placeholderValue}
                    onKeyDown={props.handleOnKeyDown}
                />
                
            </form>
        </div>
    )
}