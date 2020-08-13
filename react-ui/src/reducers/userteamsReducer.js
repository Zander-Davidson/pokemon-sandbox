import { NEW_TEAM, DELETE_TEAM, EDIT_TEAM, FETCH_TEAMS, LOADING_TEAMS, SET_ACTIVE_TEAM } from '../actions/types'

const initialState = {
    items: [],
    activeTeam: {},
    fetching: false,
}

export default function(state = initialState, action) {

    switch(action.type) {
        // payload: ~true or false~
        case LOADING_TEAMS:
            return {
                ...state,
                fetching: action.payload
            }
        // payload: teams
        case FETCH_TEAMS:
            return {
                ...state,
                items: action.payload,
                activeTeam: action.payload == [] ? null : action.payload[0]
            }
        // payload: teams
        case NEW_TEAM:
            return {
                ...state,
                items: action.payload,
                activeTeam: state.items[0]
            }
        // payload: {teamId: teamId, newName: teamName}
        case EDIT_TEAM:
            return {
                ...state,
                items: state.items.map(t => {
                    if (t.id === action.payload.teamId)
                        t.name = action.payload.newName
                    return t
                })
            }
        // payload: teamId
        case DELETE_TEAM:
            return {
                ...state,
                items: state.items.filter(t => t.id != action.payload),
                activeTeam: null,
            }            
        case SET_ACTIVE_TEAM:
            return {
                ...state,
                activeTeam: action.payload
            }
        default:
            return state
    }
}