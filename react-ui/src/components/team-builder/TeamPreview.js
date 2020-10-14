import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSets, setActiveTeam } from '../../redux/actions/userActions';
import LoadSpinner from '../tools/LoadSpinner';
import styles from '../../styling/master.scss';

export default function TeamPreview() {
    const { teamPreviews, teamsFetching } = useSelector(state => state.user);
    const [previewDeck, setPreviewDeck] = useState([]);
    
    useEffect(() => {
        setPreviewDeck(teamPreviews.map(t => {
            let spriteUrls = t.sets.map(s => {
                return s.sprite_link
            });
            
            return <Team team={t} spriteUrls={spriteUrls} />
        }))
    }, [teamPreviews]);
    
    return (
        <div className="team-previews-wrapper">
        {/* <LoadSpinner isLoading={teamsFetching}> */}
            {previewDeck}
        {/* </LoadSpinner> */}

        </div>
    );
};


const defaultClassName = 'team-preview';
const activeClassName = 'team-preview-active';

const Team = (props) => {
    const dispatch = useDispatch();
    const { activeTeamId, showTeamSprites } = useSelector(state => state.user)

    const [className, setClassName] = useState(defaultClassName)
    // const [showSprites, setShowSprites] = useState();
    const [spriteRow, setSpriteRow] = useState();

    useEffect(() => {
        setSpriteRow(
            <div className="team-preview-sprite-row">
                {props.spriteUrls.map(s => {
                    return <img class="sprite" src={s}/>
                })}
            </div>
        );
    }, [props.spriteUrls]);

    useEffect(() => {
        setClassName(activeTeamId == props.team.team_id ? activeClassName : defaultClassName);
    }, [activeTeamId]);
    
    const handleTeamClick = () => {
        dispatch(fetchSets(props.team.team_id));
        dispatch(setActiveTeam(props.team.team_id));
    };

    return (
        <div className={props.team.team_id == activeTeamId ? activeClassName : defaultClassName} onClick={handleTeamClick}>
            <div className="info-bar">
                <span>{props.team.name}</span>
                <span>
                    <div>{`Created: ${props.team.created_at.month}-${props.team.created_at.day}-${props.team.created_at.year}`}</div>
                    <div>{`Updated: ${props.team.updated_at.month}-${props.team.updated_at.day}-${props.team.updated_at.year}`}</div>
                </span>
            </div>
            {showTeamSprites ? spriteRow : null}
        </div>
    )
}