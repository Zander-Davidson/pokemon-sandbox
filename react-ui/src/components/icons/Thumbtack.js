import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

const skyblue = '#21b9ff';
const gray = '#707070';

export default function Thumbtack(props) {
    const pinnedProps = {
        style: {
            transform: "rotate(270deg)",
            opacity: props.disabled ? "0.35" : "1",
        },
        color: skyblue,
        size: "1x"
    };

    const unpinnedProps = {
        style: {
            opacity: props.disabled ? "0.35" : "1"
        },
        color: gray,
        size: "1x"
    };

    const [iconProps, setIconProps] = useState({})

    useEffect(() => {
        setIconProps(props.pinned ? pinnedProps : unpinnedProps);
    }, [props.pinned])

    return <FontAwesomeIcon icon={faThumbtack} {...iconProps}/>
}
