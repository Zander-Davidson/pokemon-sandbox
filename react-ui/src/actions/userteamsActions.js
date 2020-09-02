import { NEW_TEAM, DELETE_TEAM, EDIT_TEAM, FETCH_TEAMS, LOADING_TEAMS, SET_ACTIVE_TEAM } from './types'

// TODO: user authentication

const username = 'Zander';
const endpoint = '/api/user/get-user-teams/' + username;

export const fetchUserTeams = () => dispatch => {
    dispatch({
        type: LOADING_TEAMS,
        payload: true
    })
    fetch(endpoint)
        .then(res => {
            if (!res.ok)
                throw new Error(`status ${res.status}`);
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_TEAMS,
                payload: json.user_teams
            })
            dispatch({
                type: LOADING_TEAMS,
                payload: false
            })
        })
        .catch(e => {
            console.log(`API call failed: ${e}`);
        })
}

export const createTeam = (newTeamName) => dispatch => {
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            newTeamName: newTeamName,
        })
    })
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        return res.json();
    })
    .then(json => dispatch({
        type: NEW_TEAM,
        payload: json.results.teams
    }))
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}

export const deleteTeam = (teamId) => dispatch => {
    fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            teamId: teamId,
        })
    })
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
    })
    .then(() => {
        dispatch({
            type: DELETE_TEAM,
            payload: teamId
        })
    })
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}

// a new name for an existing team
export const editTeam = (teamId, newName) => dispatch => {
    fetch(endpoint, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            teamId: teamId,
            newName: newName,
        })
    })
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
    })
    .then(() => {
        dispatch({
            type: EDIT_TEAM,
            payload: {teamId: teamId, newName: newName}
        })
    })
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}

export const setActiveTeam = (team) => dispatch => {
    dispatch({
        type: SET_ACTIVE_TEAM,
        payload: team
    })
}