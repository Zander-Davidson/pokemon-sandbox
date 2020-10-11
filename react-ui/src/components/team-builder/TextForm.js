import React, { useEffect, useRef } from 'react';

export default function TextForm(props) {
    const inputRef = useRef();
    let value;

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <form className={props.className} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <input
                ref={inputRef}
                type='text'
                value={value}
                style={{
                    fontSize: 'small',
                    height: '25px',
                    width: '170px'
                }}
                placeholder={props.placeholderValue}
                onKeyDown={props.handleOnKeyDown}
                onBlur={props.handleOnBlur}
            />
        </form>
    )
}