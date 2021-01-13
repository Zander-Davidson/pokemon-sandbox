import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSet, deleteSet } from '../../redux/actions/userActions';
import { Plus, Trash } from '../icons/FAIcons';
import styles from '../../styling/master.scss';
import FocusTypeahead from './FocusTypeahead';

const isCreatingSetStyle = {
    color: "#1ce626", // green 
    pointerEvents: "none"
};

const flashDeleteStyle = {
    color: "#ff2b1c"
}

const disabledBtnStyle = {
    opacity: "0.5",
    pointerEvents: "none",
}

export default function SetViewButtonBar() {
    const dispatch = useDispatch();
    const { activeTeamId, activeSetId, setNest } = useSelector(state => state.user);
    const { pokemonNames } = useSelector(state => state.pokemon);
    
    const [showNewSetForm, setShowNewSetForm] = useState(false);
    const [newSetBtnStyle, setNewSetBtnStyle] = useState({});
    const [flashDeleteColor, setFlashDeleteColor] = useState(false);

    useEffect(() => {
        if (!activeTeamId || (setNest.get(activeTeamId) && setNest.get(activeTeamId).size >= 6)) {
            setNewSetBtnStyle(disabledBtnStyle);
        } else {
            setNewSetBtnStyle({});
        }
    }, [activeTeamId, setNest.get(activeTeamId) ? setNest.get(activeTeamId).size : null]);

    const handleNewSetClick = () => {
        setShowNewSetForm(true);
        setNewSetBtnStyle(isCreatingSetStyle);
    }

    const handleNewSetBlur = () => {
        setShowNewSetForm(false);
        if (setNest.get(activeTeamId).size >= 6) {
            setNewSetBtnStyle(disabledBtnStyle);
        } else {
            setNewSetBtnStyle({});
        }
    }

    const handleNewSetEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();

            setShowNewSetForm(false);
            setNewSetBtnStyle({});

            dispatch(createSet({
                teamId: activeTeamId,
                pokemonName: event.target.value
            }))
        }
    }

    const handleDeleteSetClick = () => {
        setShowNewSetForm(false);
        setFlashDeleteColor(true);
        setTimeout(() => {
            setFlashDeleteColor(false);
        }, 200);
        dispatch(deleteSet(activeTeamId, activeSetId));
    }

    let deleteBtnStyle;
    if (flashDeleteColor) {
        deleteBtnStyle = flashDeleteStyle;
    } else if (!activeSetId) {
        deleteBtnStyle = disabledBtnStyle;
    } else {
        deleteBtnStyle = null;
    }

    return (
        <div>
            <div className={showNewSetForm ? 'new-set-form-open' : 'new-set-form'}>
                <FocusTypeahead
                    options={pokemonNames}
                    showForm={showNewSetForm}
                    placeholderValue={"New pokemon"}
                    handleOnKeyDown={handleNewSetEnter}
                    handleOnBlur={handleNewSetBlur}
                />
            </div>

            <div className="button-bar">
                <span className="button" onClick={handleNewSetClick} style={newSetBtnStyle}><Plus /></span>
                <span className="button" onClick={handleDeleteSetClick} style={deleteBtnStyle}><Trash /></span>
            </div>
        </div>
    )
}