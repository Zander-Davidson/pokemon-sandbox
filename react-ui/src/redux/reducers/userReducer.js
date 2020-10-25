import { SUCCESS } from "../errorMsgs";
import {
    DELETE_TEAM, EDIT_TEAM, SET_ACTIVE_TEAM, NEW_SET, SET_ACTIVE_SET, EDIT_SET, DELETE_SET,
    FETCH_TEAM_PREVIEWS, FETCH_TEAM_PREVIEWS_FAILURE, FETCH_TEAM_PREVIEWS_SUCCESS,
    FETCH_SETS, FETCH_SETS_FAILURE, FETCH_SETS_SUCCESS,
    CREATE_TEAM_SUCCESS, CREATE_TEAM_FAILURE, UPDATE_TEAM_SUCCESS, UPDATE_TEAM_FAILURE, DELETE_TEAM_SUCCESS, DELETE_TEAM_FAILURE,
    SET_SHOW_TEAM_SPRITES, SET_ORDER_TEAMS_DIR
} from '../actions/types'

const initialState = {
    activeTeamId: null,
    activeTeamName: null,
    teamPreviews: [],
    setNest: new Map(),
    userTeams: [],
    userSets: [],
    activeTeamGuid: null,
    activeSetGuid: null,
    showTeamSprites: true,
    orderTeamsBy: 'desc',
    teamsFetching: false,
    teamsFetched: false,
    setsFetching: false,
    setsFetched: false,
    userSetsFetching: false,
    userSetsFetched: false,
    errorMsg: ''
}

export default function (state = initialState, action) {

    switch (action.type) {
        case FETCH_TEAM_PREVIEWS:
            return {
                ...state,
                teamsFetching: true
            }

        case FETCH_TEAM_PREVIEWS_FAILURE:
            return {
                ...state,
                teamsFetching: false,
                teamsFetched: false,
                errorMsg: action.payload
            }

        case FETCH_TEAM_PREVIEWS_SUCCESS:
            return {
                ...state,
                teamsFetching: false,
                teamsFetched: true,
                teamPreviews: action.payload,
                errorMsg: SUCCESS
            }

        case FETCH_SETS:
            return {
                ...state,
                setsFetching: true
            }

        case FETCH_SETS_FAILURE:
            return {
                ...state,
                setsFetching: false,
                setsFetched: false,
                errorMsg: action.payload
            }

        // recieves teamId as key, set array as value
        case FETCH_SETS_SUCCESS:
            let setMap = new Map();
            action.payload.value.forEach(s => {
                setMap.set(s.set_id, s);
            });

            return {
                ...state,
                setsFetching: false,
                setsFetched: true,
                setNest: state.setNest.set(action.payload.key, setMap),
                errorMsg: ""
            }

        case CREATE_TEAM_FAILURE:
            return {
                ...state,
                errorMsg: action.payload
            }

        case CREATE_TEAM_SUCCESS:
            console.log(action.payload)
            return {
                ...state,
                activeTeamId: action.payload.team_id,
                activeTeamName: action.payload.name,
                teamPreviews: [action.payload, ...state.teamPreviews],
                errorMsg: SUCCESS
            }

        case UPDATE_TEAM_FAILURE:
            return {
                ...state,
                errorMsg: action.payload
            }

        // action.payload = team
        case UPDATE_TEAM_SUCCESS:
            return {
                ...state,
                teamPreviews: state.teamPreviews.map(t => {
                    return t.team_id == action.payload.team_id ?
                        { ...t, name: action.payload.name } : t;
                }),
                errorMsg: SUCCESS
            }

        case DELETE_TEAM_FAILURE:
            return {
                ...state,
                errorMsg: action.payload
            }

        // action.payload = team_id
        case DELETE_TEAM_SUCCESS:
            return {
                ...state,
                activeTeamId: null,
                activeTeamName: null,
                teamPreviews: state.teamPreviews.filter(t => t.team_id != action.payload),
                errorMsg: SUCCESS
            }

        // action.payload = team_id
        case SET_ACTIVE_TEAM:
            let clickedTeamId = action.payload;
            let newActiveId = null;
            let newActiveName = null;

            if (clickedTeamId != state.activeTeamId) {
                newActiveId = clickedTeamId;

                for (let i = 0; i < state.teamPreviews.length; i++) {
                    if (state.teamPreviews[i].team_id == action.payload)
                        newActiveName = state.teamPreviews[i].name;
                }
            }

            return {
                ...state,
                activeTeamName: newActiveName,
                activeTeamId: newActiveId
            }

        case SET_SHOW_TEAM_SPRITES:
            return {
                ...state,
                showTeamSprites: !state.showTeamSprites
            }

        case SET_ORDER_TEAMS_DIR:
            return {
                ...state,
                orderTeamsBy: action.payload === 'asc' ? 'asc' : 'desc'
            }

        // // payload: userSets
        // case FETCH_SETS:
        //     return {
        //         ...state,
        //         userSetsFetched: true,
        //         userSets: action.payload,
        //         activeSetGuid: action.payload === [] ? null : action.payload[0].guid
        //     }
        case SET_ACTIVE_SET:
            return {
                ...state,
                activeSetGuid: state.userSets.filter(s => s.guid === action.payload)[0] || null,
            }


        // // payload: teams
        // case NEW_TEAM:
        //     return {
        //         ...state,
        //         userTeams: action.payload,
        //         activeTeamGuid: state.userTeams[0]
        //     }
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