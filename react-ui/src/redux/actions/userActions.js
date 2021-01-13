import { SUCCESS, USER_NOT_LOGGED_IN } from "../errorMsgs";
import {
    NEW_TEAM, DELETE_TEAM, EDIT_TEAM, FETCH_TEAMS, LOADING_TEAMS, SET_ACTIVE_TEAM, CACHE_USER_SETS, NEW_SET, SET_ACTIVE_SET,
    FETCH_TEAM_PREVIEWS, FETCH_TEAM_PREVIEWS_FAILURE, FETCH_TEAM_PREVIEWS_SUCCESS,
    FETCH_SETS, FETCH_SETS_FAILURE, FETCH_SETS_SUCCESS,
    CREATE_TEAM_SUCCESS, CREATE_TEAM_FAILURE, UPDATE_TEAM_SUCCESS, UPDATE_TEAM_FAILURE, DELETE_TEAM_SUCCESS, DELETE_TEAM_FAILURE,
    CREATE_SET_SUCCESS, CREATE_SET_FAILURE, UPDATE_SET_SUCCESS, UPDATE_SET_FAILURE, DELETE_SET_SUCCESS, DELETE_SET_FAILURE,
    SET_SHOW_TEAM_SPRITES, SET_ORDER_TEAMS_DIR
} from './types';
import authHeader from '../../services/authHeader';
// normally this isn't recommended, but redux has no builtin solution for caching.
// fun fact: the creator of react-redux says caching is an acceptable reason to use the global state in actions
import { store } from '../store';
import { getCacheItemByGuid, cachePush, cacheSearchAndSplice } from '../../utilities/cache';

const API_TEAM_PREVIEWS_URL = '/api/user/teampreviews'
const API_SETS_URL = '/api/user/setsbyteam';
const API_CREATE_TEAM_URL = '/api/user/createteam';
const API_UPDATE_TEAM_URL = '/api/user/updateteam';
const API_DELETE_TEAM_URL = '/api/user/deleteteam';
const API_SET_OPTIONS_URL = '/api/user/setoptions';
const API_CREATE_SET_URL = '/api/user/createset';
const API_DELETE_SET_URL = '/api/user/deleteset';


export const fetchTeamPreviews = (params) => dispatch => {
    dispatch({ type: FETCH_TEAM_PREVIEWS });

    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_TEAM_PREVIEWS_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...params, user_id: user.user_id })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.json())
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: FETCH_TEAM_PREVIEWS_SUCCESS,
                    payload: json.teamPreviews
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCH_TEAM_PREVIEWS_FAILURE,
                    payload: error.message
                });
            })
    } else {
        dispatch({
            type: FETCH_TEAM_PREVIEWS_FAILURE,
            payload: USER_NOT_LOGGED_IN
        });
    }
}

export const fetchSets = (teamId) => dispatch => {
    dispatch({ type: FETCH_SETS });

    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_SETS_URL + `/${user.user_id}/${teamId}`, {
            method: 'GET',
            headers: authHeader()
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.json())
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: FETCH_SETS_SUCCESS,
                    payload: {
                        key: teamId,
                        value: json.userSets
                    }
                });

                return json.userSets
            })
            .then(userSets => {
                if (userSets.length > 0) {
                    setActiveSet(userSets[0].set_id)(dispatch);
                }
            })
            .catch(error => {
                dispatch({
                    type: FETCH_SETS_FAILURE,
                    payload: error.message
                });
            })
    } else {
        dispatch({
            type: FETCH_SETS_FAILURE,
            payload: USER_NOT_LOGGED_IN
        });
    }
}

export const createTeam = (newTeamData) => dispatch => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_CREATE_TEAM_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.user_id,
                name: newTeamData.name
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.json())
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: CREATE_TEAM_SUCCESS,
                    payload: json.newTeamPreview
                });
            })
            .catch(error => {
                dispatch({
                    type: CREATE_TEAM_FAILURE,
                    payload: error.message
                });
            })
    } else {
        dispatch({
            type: CREATE_TEAM_FAILURE,
            payload: USER_NOT_LOGGED_IN
        });
    }
}

export const updateTeam = (teamData) => dispatch => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_UPDATE_TEAM_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.user_id,
                team_id: teamData.team_id,
                name: teamData.name
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.json())
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: UPDATE_TEAM_SUCCESS,
                    payload: json.updatedTeam
                });
            })
            .catch(error => {
                dispatch({
                    type: UPDATE_TEAM_FAILURE,
                    payload: error.message
                });
            })
    } else {
        dispatch({
            type: UPDATE_TEAM_FAILURE,
            payload: USER_NOT_LOGGED_IN
        });
    }
}

export const deleteTeam = (teamData) => dispatch => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_DELETE_TEAM_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.user_id,
                team_id: teamData.team_id
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.json())
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: DELETE_TEAM_SUCCESS,
                    payload: json.deletedTeamId
                });
            })
            .catch(error => {
                dispatch({
                    type: DELETE_TEAM_FAILURE,
                    payload: error.message
                });
            })
    } else {
        dispatch({
            type: DELETE_TEAM_FAILURE,
            payload: USER_NOT_LOGGED_IN
        });
    }
}

export const setActiveTeam = (teamId) => dispatch => {
    dispatch({
        type: SET_ACTIVE_TEAM,
        payload: teamId
    });
}

export const createSet = (newSetData) => (dispatch) => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_CREATE_SET_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.user_id,
                team_id: newSetData.teamId,
                pokemon_name: newSetData.pokemonName
            })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => { throw new Error(err.message) })
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: CREATE_SET_SUCCESS,
                    payload: json.newSet
                });
            })
            .then(() => {
                fetchTeamPreviews()(dispatch);
            })
            .catch(error => {
                dispatch({
                    type: CREATE_SET_FAILURE,
                    payload: error.message
                });
            })
    } else {
        dispatch({
            type: CREATE_SET_FAILURE,
            payload: USER_NOT_LOGGED_IN
        });
    }
}

export const updateSet = (teamId, setId, data) => (dispatch) => {

}

export const deleteSet = (teamId, setId) => (dispatch) => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_DELETE_SET_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.user_id,
                team_id: teamId,
                set_id: setId
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.json());
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: DELETE_SET_SUCCESS,
                    payload: json.deletedSet
                });
            })
            .catch(error => {
                dispatch({
                    type: DELETE_SET_FAILURE,
                    payload: error.message
                });
            })
    } else {
        dispatch({
            type: DELETE_SET_FAILURE,
            payload: USER_NOT_LOGGED_IN
        });
    }
}

export const setActiveSet = (setId) => dispatch => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        fetch(API_SET_OPTIONS_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user.user_id,
                set_id: setId
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.json());
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: SET_ACTIVE_SET,
                    payload: {
                        setId: setId,
                        setOptions: json.setOptions,
                        errorMsg: json.message
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: SET_ACTIVE_SET,
                    payload: {
                        setId: setId,
                        setOptions: null,
                        errorMsg: error.message
                    }
                });
            })
    } else {
        dispatch({
            type: SET_ACTIVE_SET,
            payload: {
                setId: setId,
                setOptions: null,
                errorMsg: USER_NOT_LOGGED_IN
            }
        });
    }
}

export const setShowTeamSprites = () => dispatch => {
    dispatch({ type: SET_SHOW_TEAM_SPRITES });
}

export const setOrderTeamsBy = (orderBy) => dispatch => {
    dispatch({
        type: SET_ORDER_TEAMS_DIR,
        payload: orderBy
    });
}