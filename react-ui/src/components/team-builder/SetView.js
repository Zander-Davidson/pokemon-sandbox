import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styling/master.scss';

export default function SetView() {
    const dispatch = useDispatch();
    const { sets } = useSelector(state => state.user);

    useEffect(() => {
        console.log(sets)
    }, [sets]);

    return (
        <div className="set-view">
            Set View
        </div>
    )
}