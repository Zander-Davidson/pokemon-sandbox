import { SUCCESS } from "../errorMsgs";
import {
    DELETE_TEAM, EDIT_TEAM, SET_ACTIVE_TEAM, NEW_SET, SET_ACTIVE_SET, EDIT_SET,
    FETCH_TEAM_PREVIEWS, FETCH_TEAM_PREVIEWS_FAILURE, FETCH_TEAM_PREVIEWS_SUCCESS,
    FETCH_SETS, FETCH_SETS_FAILURE, FETCH_SETS_SUCCESS,
    CREATE_TEAM_SUCCESS, CREATE_TEAM_FAILURE, UPDATE_TEAM_SUCCESS, UPDATE_TEAM_FAILURE, DELETE_TEAM_SUCCESS, DELETE_TEAM_FAILURE,
    CREATE_SET_SUCCESS, CREATE_SET_FAILURE, UPDATE_SET_SUCCESS, UPDATE_SET_FAILURE, DELETE_SET_SUCCESS, DELETE_SET_FAILURE,
    SET_SHOW_TEAM_SPRITES, SET_ORDER_TEAMS_DIR
} from '../actions/types'
import { deleteSet } from "../actions/userActions";

const initialState = {
    activeTeamId: null,
    activeSetId: null,
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
    var setMap;

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
            setMap = new Map();
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
                activeSetId: null,
                teamPreviews: state.teamPreviews.filter(t => t.team_id != action.payload),
                errorMsg: SUCCESS
            }

        case CREATE_SET_FAILURE:
            return {
                ...state,
                errorMsg: action.payload
            }

        case CREATE_SET_SUCCESS:
            let newSet = action.payload;
            setMap = state.setNest.get(newSet.team_id).set(newSet.set_id, newSet);

            return {
                ...state,
                activeSetId: newSet.set_id,
                setNest: state.setNest.set(newSet.team_id, setMap),
                errorMsg: SUCCESS
            }

        case UPDATE_SET_FAILURE:
            return {
                ...state,
                errorMsg: action.payload
            }

        // action.payload = team
        case UPDATE_SET_SUCCESS:
            return {
                ...state,
                // teamPreviews: state.teamPreviews.map(t => {
                //     return t.team_id == action.payload.team_id ?
                //         { ...t, name: action.payload.name } : t;
                // }),
                errorMsg: SUCCESS
            }

        case DELETE_SET_FAILURE:
            return {
                ...state,
                errorMsg: action.payload
            }

        // action.payload = {set_id, team_id}
        case DELETE_SET_SUCCESS:
            let deletedSet = action.payload;
            setMap = state.setNest
            setMap.get(deletedSet.team_id).delete(deletedSet.set_id);

            return {
                ...state,
                activeSetId: null,
                teamPreviews: state.teamPreviews.map(t => {
                    return t.team_id != deletedSet.team_id ?
                        t
                        : {
                            ...t,
                            sets: t.sets.filter(s => s.set_id != deletedSet.set_id),
                        }
                }),
                setNest: setMap,
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

        case SET_ACTIVE_SET:
            return {
                ...state,
                activeSetId: action.payload != state.activeSetId ? action.payload : state.activeSetId
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

        default:
            return state
    }
}