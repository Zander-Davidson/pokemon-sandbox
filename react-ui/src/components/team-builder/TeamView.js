import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamPreviews, createTeam, updateTeam, deleteTeam, setShowTeamSprites } from '../../redux/actions/userActions';
import FocusTextForm from "./FocusTextForm";
import TeamSearchForm from "./TeamSearchForm";
import TeamPreview from "./TeamPreview";
import { Sort, Search, Filter, Plus, Edit, Trash, List, Random, Image, SortAmountDownAlt, SortAmountUp } from '../icons/FAIcons';
import styles from '../../styling/master.scss';

const isEditingNameStyle = {
    // backgroundColor: "inherit", 
    color: "#ffbd69", // gold 
    pointerEvents: "none"
};

const isSearchingStyle = {
    // backgroundColor: "inherit", 
    color: "#03b1fc", // blue 
    cursor: "default !important",
    // pointerEvents: "none"
};

const isCreatingTeamStyle = {
    // backgroundColor: "inherit", 
    color: "#1ce626", // green 
    pointerEvents: "none"
};

const flashDisplayStyle = {
    color: "#ff8a1c"
}

const flashDeleteStyle = {
    color: "#ff2b1c"
}

const disabledBtnStyle = {
    opacity: "0.5",
    pointerEvents: "none",
}

export default function TeamView() {
    const dispatch = useDispatch();
    
    const { activeTeamId, activeTeamName, teamsFetching, showTeamSprites } = useSelector(state => state.user);
    const [showNewTeamForm, setShowNewTeamForm] = useState(false);
    const [showEditNameForm, setShowEditNameForm] = useState(false);
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [orderBy, setOrderBy] = useState('updated_at');
    const [orderDir, setOrderDir] = useState('desc');
    const [editNameBtnStyle, setEditNameBtnStyle] = useState({});
    const [newTeamBtnStyle, setNewTeamBtnStyle] = useState({});
    const [flashDisplayColor, setFlashDisplayColor] = useState(false);
    const [flashDeleteColor, setFlashDeleteColor] = useState(false);

    useEffect(() => {
        if (!activeTeamId) {
            setEditNameBtnStyle(disabledBtnStyle);
        } else if (showEditNameForm) {
            setEditNameBtnStyle(isEditingNameStyle);
        } else {
            setEditNameBtnStyle({});
        }
    }, [activeTeamId, showEditNameForm]);

    useEffect(() => {
        if (showNewTeamForm) {
            setNewTeamBtnStyle(isCreatingTeamStyle);
        } else {
            setNewTeamBtnStyle({});
        }
    }, [showNewTeamForm]);

    const handleNewTeamClick = () => {
        // TODO: conflicts with handleNewTeamBlur, need to fix this. currently using an alt style when clicked
        setShowEditNameForm(false);
        setShowSearchForm(false);
        setShowNewTeamForm(true);
    }

    const handleNewTeamBlur = () => {
        setShowNewTeamForm(false);
    }

    const handleNewTeamEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();

            setShowNewTeamForm(false);
            dispatch(createTeam({ name: event.target.value }))
        }
    }

    const handleEditNameClick = () => {
        // conflicts with handleEditNameBlur, need to fix this. currently using an alt style when clicked
        setShowSearchForm(false)
        setShowNewTeamForm(false);
        setShowEditNameForm(true);
    }

    const handleEditNameBlur = () => {
        setShowEditNameForm(false);
    }

    const handleEditNameEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            let name = event.target.value

            setShowEditNameForm(false);
            dispatch(updateTeam({
                team_id: activeTeamId,
                name: name
            }));
        }
    }

    const handleSearchClick = () => {
        setShowEditNameForm(false);
        setShowNewTeamForm(false);
        setShowSearchForm(!showSearchForm);
    }

    const handleSearchMouseLeave = () => {
        setShowSearchForm(false);
    }

    const handleSearchEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        setShowSearchForm(false);
        dispatch(fetchTeamPreviews({
            orderBy: orderBy,
            orderDir: orderDir
        }));
    }

    const handleOrderByChange = (event) => {
        setOrderBy(event.target.value);
    }

    const handleOrderDirChange = (dir) => {
        setOrderDir(dir);
    }

    // const handleFilterBtnMouseEnter = () => {
    //     setShowFilterForm(true);
    // }

    // const handleFilterBtnMouseLeave = () => {
    //     setTimeout(function(isFiltering) {
    //         if (!isFiltering) {
    //             setShowFilterForm(false);
    //         }
    //     }, 200, isFiltering);
    // }

    // const handleFilterMouseEnter = () => {
    //     setIsFiltering(true);
    // }

    const handleDisplayClick = () => {
        setShowSearchForm(false);
        setShowNewTeamForm(false);
        setShowEditNameForm(false);
        setFlashDisplayColor(true);
        setTimeout(() => {
            setFlashDisplayColor(false);
        }, 200);
        dispatch(setShowTeamSprites());
    }

    const handleDeleteTeamClick = () => {
        setShowSearchForm(false);
        setShowNewTeamForm(false);
        setShowEditNameForm(false);
        setFlashDeleteColor(true);
        setTimeout(() => {
            setFlashDeleteColor(false);
        }, 200);
        dispatch(deleteTeam({
            team_id: activeTeamId
        }));
    }

    let deleteBtnStyle;
    if (flashDeleteColor) {
        deleteBtnStyle = flashDeleteStyle;
    } else if (!activeTeamId) {
        deleteBtnStyle = disabledBtnStyle;
    } else {
        deleteBtnStyle = null;
    }

    return (
        <div className="team-view">
            <div className={showNewTeamForm || showEditNameForm ? 'team-name-form-open' : 'team-name-form'}>
                <FocusTextForm
                    charLimit={20}
                    showForm={showNewTeamForm || showEditNameForm}
                    placeholderValue={showNewTeamForm ? "New team" : activeTeamName}
                    handleOnKeyDown={showNewTeamForm ? handleNewTeamEnter : handleEditNameEnter}
                    handleOnBlur={showNewTeamForm ? handleNewTeamBlur : handleEditNameBlur}
                />
            </div>

            <div className={showSearchForm ? 'team-search-form-open' : 'team-search-form'}>
                <form className="search-stack">
                    <select className="focus-text-box" onChange={handleOrderByChange}>
                        <option value="" selected disabled hidden>Sort by...</option>
                        <option value="name">Team name</option>
                        <option value="created_at">Date created</option>
                        <option value="updated_at">Date updated</option>
                    </select>
                    <button className='focus-text-box' onClick={handleSearchEnter}>Sort</button>
                </form>

                <div className="button-stack">
                    <div
                        className="button"
                        onClick={() => handleOrderDirChange('desc')}
                        style={orderDir === 'desc' ? isSearchingStyle : null}
                    ><SortAmountUp /></div>
                    <div
                        className="button"
                        onClick={() => handleOrderDirChange('asc')}
                        style={orderDir === 'asc' ? isSearchingStyle : null}
                    ><SortAmountDownAlt /></div>
                </div>
            </div>

            <div className="button-bar">
                <span className="button" onClick={handleNewTeamClick} style={newTeamBtnStyle}><Plus /></span>
                <span className="button" onClick={handleEditNameClick} style={editNameBtnStyle}><Edit /></span>
                {/* <span className="button" onMouseEnter={handleFilterBtnMouseEnter} onMouseLeave={handleFilterBtnMouseLeave}><SortAmountUp /></span> */}
                <span className="button" onClick={handleSearchClick} style={showSearchForm ? isSearchingStyle : null}><Sort /></span>
                <span className="button" onClick={handleDisplayClick} style={flashDisplayColor ? flashDisplayStyle : null}>{showTeamSprites ? <List /> : <Image />}</span>
                <span className="button" onClick={handleDeleteTeamClick} style={deleteBtnStyle}><Trash /></span>
            </div>
            <div className="divider"></div>
            <TeamPreview />
        </div>
    )
}