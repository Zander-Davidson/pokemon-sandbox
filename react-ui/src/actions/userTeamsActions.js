import { NEW_TEAM, DELETE_TEAM, EDIT_TEAM, FETCH_TEAMS, LOADING_TEAMS, SET_ACTIVE_TEAM, FETCH_SETS, LOADING_SETS, CACHE_USER_SETS, NEW_SET, SET_ACTIVE_SET } from './types';
// normally this isn't recommended, but redux has no builtin solution for caching.
// fun fact: the creator of react-redux says caching is an acceptable reason to use the global state in actions
import store from '../store';
import { getCacheItemByGuid, cachePush, cacheSearchAndSplice } from '../utilities/cache';


// TODO: user authentication

const username = 'Zander';

const fetchTeamsEndpoint = '/api/user/get-user-teams/' + username;
const fetchSetsEndpoint = '/api/user/get-user-sets-by-team/';


export const setActiveUserSet = (userTeamGuid, userSetGuid) => dispatch => {
    let cacheCheck = cacheSearchAndSplice(store.userSets, userSetGuid);

    if (cacheCheck) {
        dispatch({
            type: CACHE_USER_SETS,
            payload: cacheCheck
        });
    } else {
        fetchUserSets(userTeamGuid);
    }
}

export const setActiveUserTeam = (userTeamGuid) => dispatch => {}

export const fetchUserTeams = () => dispatch => {
    dispatch({
        type: LOADING_TEAMS,
        payload: true
    })
    fetch(fetchTeamsEndpoint)
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

            if (json.user_teams !== []) {
                fetchUserSets(json.user_teams[0].guid)
            }
        })
        .catch(e => {
            console.log(`API call failed (userTeamsActions.fetchUserTeams): ${e}`);
        })
}

export const fetchUserSets = (userTeamGuid) => dispatch => {
    dispatch({
        type: LOADING_SETS,
        payload: true
    });
    fetch(fetchSetsEndpoint + userTeamGuid)
        .then(res => {
            if (!res.ok)
                throw new Error(`status ${res.status}`);
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_SETS,
                payload: cachePush(store.userSets, json.user_sets)
            })
            dispatch({
                type: LOADING_SETS,
                payload: false
            })
        })
        .catch(e => {
            console.log(`API call failed: ${e}`);
        })
}

// export const createTeam = (newTeamName) => dispatch => {
//     fetch(endpoint, {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             username: username,
//             newTeamName: newTeamName,
//         })
//     })
//     .then(res => {
//         if (!res.ok)
//             throw new Error(`status ${res.status}`);
//         return res.json();
//     })
//     .then(json => dispatch({
//         type: NEW_TEAM,
//         payload: json.results.teams
//     }))
//     .catch(e => {
//         console.log(`API call failed (userTeamsActions.createUserTeam): ${e}`);
//     })
// }

// export const deleteTeam = (teamId) => dispatch => {
//     fetch(endpoint, {
//         method: 'DELETE',
//         headers: {
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             username: username,
//             teamId: teamId,
//         })
//     })
//     .then(res => {
//         if (!res.ok)
//             throw new Error(`status ${res.status}`);
//     })
//     .then(() => {
//         dispatch({
//             type: DELETE_TEAM,
//             payload: teamId
//         })
//     })
//     .catch(e => {
//         console.log(`API call failed (userTeamsActions.deleteUserTeam): ${e}`);
//     })
// }

// // a new name for an existing team
// export const editTeam = (teamId, newName) => dispatch => {
//     fetch(endpoint, {
//         method: 'PUT',
//         headers: {
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             username: username,
//             teamId: teamId,
//             newName: newName,
//         })
//     })
//     .then(res => {
//         if (!res.ok)
//             throw new Error(`status ${res.status}`);
//     })
//     .then(() => {
//         dispatch({
//             type: EDIT_TEAM,
//             payload: {teamId: teamId, newName: newName}
//         })
//     })
//     .catch(e => {
//         console.log(`API call failed (userTeamsActions.editUserTeam): ${e}`);
//     })
// }