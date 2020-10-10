import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { fetchTeamPreviews } from '../../redux/actions/userActions';
import TeamPreview from "./TeamPreview";
import { Button } from "react-bootstrap";
import styles from '../../styling/master.scss';

export default function TeamView() {
    const dispatch = useDispatch();
    const { teamPreviews } = useSelector(state => state.user);

    const [previewCards, setPreviewCards] = useState([]);
    
    useEffect(() => {
        dispatch(fetchTeamPreviews());
    }, []);

    useEffect(() => {
        setPreviewCards(teamPreviews.map(t => {
            let spriteUrls = t.sets.map(s => {
                return s.sprite_link
            });

            return <TeamPreview id={t.team_id} name={t.name} spriteUrls={spriteUrls}/>
        }))
    }, [teamPreviews]);
    
    return (

        <div className="team-view">
            <Button bsStyle="default" className="btn-1" size="sm">New Team</Button>
            <div className="team-previews-wrapper">
                {previewCards}
            </div>
        </div>
    )
}