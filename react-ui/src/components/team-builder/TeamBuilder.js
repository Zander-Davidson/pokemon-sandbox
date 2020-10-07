import React, { useEffect, useState } from 'react'
import TeamView from './TeamView';
import SetView from './SetView';
import styles from '../../styling/master.scss';

export default function TeamBuilder() {

    return (
        <div className="team-builder">
            <TeamView/>
            <SetView/>
        </div>
    )
}