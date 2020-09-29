import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from '../styling/master.scss'

export default function IconPicker(props) {
    const [icon, setIcon] = useState(null);
    const { items } = useSelector(state => state.icons);

    let handleIconClick = (name) => {
        setIcon(name);
    };

    let icons = items.forEach(i => {
        return (
            <Dropdown.Item>
                <img className="icon" src={i.image_url} onClick={handleIconClick(i.name)}/>
            </Dropdown.Item>
        )
    });

    return (
        <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
                {icon ? icon : "Choose Icon"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {icons}
            </Dropdown.Menu>
        </Dropdown>
        
    )
};