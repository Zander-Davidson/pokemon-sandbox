import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SetPicker from './SetPicker';
import styles from '../../styling/master.scss';

export default function SetView() {
    const dispatch = useDispatch();
    const { activeTeamId, teamsFetching, setsFetched } = useSelector(state => state.user);

    return (
        <div className="set-view">
            <SetPicker />
            <div className='set-view-content-wrapper'>
                <div className="button-bar">
                    Button Bar
                </div>
            </div>
        </div>
    )
}