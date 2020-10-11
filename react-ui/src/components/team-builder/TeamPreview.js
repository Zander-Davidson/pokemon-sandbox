import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSets, updateTeam, deleteTeam } from '../../redux/actions/userActions';
import TextForm from './TextForm';
import Edit from '../icons/Edit';
import Trash from '../icons/Trash';
import styles from '../../styling/master.scss';

export default function TeamPreview(props) {
    const dispatch = useDispatch();

    const [imgs, setImgs] = useState();
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        setImgs(props.spriteUrls.map(s => {
            return <img class="sprite" src={s}/>
        }));
    }, [props.spriteUrls]);
    
    const handleTeamClick = () => {
        dispatch(fetchSets(props.id));
    };

    const handleEditClick = () => {
        setShowEditForm(true);
    }

    const handleDeleteClick = () => {
        dispatch(deleteTeam({
            team_id: props.id
        }));
    }

    const handleEditBlur = () => {
        setShowEditForm(false);
    }

    const handleEditEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            let name = event.target.value

            setShowEditForm(false);
            dispatch(updateTeam({
                team_id: props.id,
                name: name
            }));
        }
    }

    return (
        <div className="team-preview">
            {showEditForm ? 
                <TextForm 
                    placeholderValue="new name" 
                    handleOnKeyDown={handleEditEnter}
                    handleOnBlur={handleEditBlur}
                />
                : 
                <div className='edit-team-bar'>
                    <span className='icon' onClick={handleEditClick}><Edit/></span>
                    <span >{props.name}</span>
                    <span className="icon" onClick={handleDeleteClick}><Trash/></span>
                </div> 
            }
            <div className="team-preview-sprite-row" onClick={handleTeamClick}>
                {imgs}
            </div>
        </div>
    )
}