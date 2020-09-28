import { NEW_TEAM, DELETE_TEAM, EDIT_TEAM, FETCH_TEAMS, LOADING_TEAMS, SET_ACTIVE_TEAM, FETCH_SETS, LOADING_SETS, NEW_SET, SET_ACTIVE_SET, EDIT_SET, DELETE_SET } from '../actions/types'

const initialState = {
    userTeams: [],
    userSets: [],
    activeTeamGuid: null,
    activeSetGuid: null,
    userTeamsFetching: false,
    userTeamsFetched: false,
    userSetsFetching: false,
    userSetsFetched: false
}

export default function (state = initialState, action) {

    switch (action.type) {
        // payload: ~true or false~
        case LOADING_TEAMS:
            return {
                ...state,
                userTeamsFetching: action.payload
            }
        // payload: teams
        case FETCH_TEAMS:
            return {
                ...state,
                userTeamsFetched: true,
                userTeams: action.payload,
                activeTeamGuid: action.payload === [] ? null : action.payload[0].guid
            }
        // payload: ~true or false~
        case LOADING_SETS:
            return {
                ...state,
                userSetsFetching: action.payload
            }
        // payload: userSets
        case FETCH_SETS:
            return {
                ...state,
                userSetsFetched: true,
                userSets: action.payload,
                activeSetGuid: action.payload === [] ? null : action.payload[0].guid
            }
        case SET_ACTIVE_TEAM:
            return {
                ...state,
                activeTeamGuid: state.userTeams.filter(t => t.guid === action.payload)[0] || null,
            }
        case SET_ACTIVE_SET:
            return {
                ...state,
                activeSetGuid: state.userSets.filter(s => s.guid === action.payload)[0] || null,
            }
        






        // payload: teams
        case NEW_TEAM:
            return {
                ...state,
                userTeams: action.payload,
                activeTeamGuid: state.userTeams[0]
            }
        // payload: {teamId: teamId, newName: teamName}
        case EDIT_TEAM:
            return {
                ...state,
                userTeams: state.userTeams.map(t => {
                    if (t.id === action.payload.teamId)
                        t.name = action.payload.newName
                    return t
                })
            }
        // payload: teamId
        case DELETE_TEAM:
            return {
                ...state,
                userTeams: state.userTeams.filter(t => t.id != action.payload),
                activeTeamGuid: null,
            }
        
            // needs lotta work
        // payload: userSets
        case NEW_SET:
            return {
                ...state,
                userSets: action.payload,
                activeSet: state.userSets[0],
            }
        // payload: {setGuid: setGuid, newName: setName}
        case EDIT_SET:
            return {
                ...state,
                userSets: state.userSets.map(t => {
                    if (t.id === action.payload.teamId) {
                        t.name = action.payload.newName
                    }
                    return t
                })
            }
        // payload: teamId
        case DELETE_SET:
            return {
                ...state,
                userSets: state.userSets.filter(t => t.id != action.payload),
                activeSet: null,
            }
        default:
            return state
    }
}