import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamPreviews } from '../../redux/actions/userActions';
import TeamView from './TeamView';
import SetView from './SetView';
import styles from '../../styling/master.scss';

export default function TeamBuilder() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTeamPreviews());
    }, []);

    return (
        <div className="team-builder">
            <TeamView/>
            <SetView/>
        </div>
    )
}