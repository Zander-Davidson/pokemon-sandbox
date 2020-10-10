import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSets } from '../../redux/actions/userActions';
import styles from '../../styling/master.scss';

export default function TeamPreview(props) {
    const dispatch = useDispatch();
    
    const handleTeamClick = () => {
        dispatch(fetchSets(props.id));
    };
    
    let imgs = props.spriteUrls.map(s => {
        return <img class="sprite" src={s}/>
    });

    return (
        <div className="team-preview" onClick={handleTeamClick}>
            <div>{props.name}</div>
            <div className="team-preview-sprite-row">
                {imgs}
            </div>
        </div>
    )
}