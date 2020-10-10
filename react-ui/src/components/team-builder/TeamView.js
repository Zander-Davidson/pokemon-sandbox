import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamPreviews, createTeam } from '../../redux/actions/userActions';
import TeamPreview from "./TeamPreview";
import { Button } from "react-bootstrap";
import styles from '../../styling/master.scss';

export default function TeamView() {
    const dispatch = useDispatch();
    const { teamPreviews } = useSelector(state => state.user);

    const [showNewTeamForm, setShowNewTeamForm] = useState(false);
    const [previewCards, setPreviewCards] = useState([]);

    useEffect(() => {
        dispatch(fetchTeamPreviews());
    }, []);

    useEffect(() => {
        console.log(teamPreviews)
        setPreviewCards(teamPreviews.map(t => {
            let spriteUrls = t.sets.map(s => {
                return s.sprite_link
            });

            return <TeamPreview id={t.team_id} name={t.name} spriteUrls={spriteUrls} />
        }))
    }, [teamPreviews]);

    const handleNewTeamClick = () => {
        setShowNewTeamForm(true);
    }

    const handleNewTeamBlur = () => {
        setShowNewTeamForm(false);
    }

    const handleNewTeamEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            let name = event.target.value

            setShowNewTeamForm(false);
            dispatch(createTeam({ name: name }))
        }
    }

    return (
        <div className="team-view">
            {showNewTeamForm ?
                <TextForm
                    className={'team-preview-wrapper'}
                    placeholderValue={'new team name'}
                    handleOnBlur={handleNewTeamBlur}
                    handleOnKeyDown={e => handleNewTeamEnter(e)}
                /> :
                <Button bsStyle="default" className="btn-1" size="sm" onClick={handleNewTeamClick}>
                    New Team
                </Button>}
            <div className="team-previews-wrapper">
                {previewCards}
            </div>
        </div>
    )
}

function TextForm(props) {
    const inputRef = useRef();
    let value;
    const [text, setText] = useState('');

    useEffect(() => {
        inputRef.current.focus();
    }, [])

    const handleTextChange = (e) => {
        e.preventDefault();
        setText(e.target.value);
    }

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
                // onChange={props.handleTextChange}
                onKeyDown={props.handleOnKeyDown}
                onBlur={props.handleOnBlur}
            />
        </form>
    )
}