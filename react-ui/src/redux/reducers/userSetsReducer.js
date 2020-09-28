// import { NEW_SET, DELETE_SET, EDIT_SET, FETCH_SETS, LOADING_SETS, SET_ACTIVE_SET } from '../actions/types'

// const initialState = {
//     items: [],
//     activeSet: {},
//     fetching: false,
//     fetched: false
// }

// export default function(state = initialState, action) {

//     switch(action.type) {
//         // payload: ~true or false~
//         case LOADING_SETS:
//             return {
//                 ...state,
//                 fetching: action.payload
//             }
//         // payload: userSets
//         case FETCH_SETS:
//             return {
//                 ...state,
//                 items: action.payload,
//                 activeSet: action.payload === [] ? null : action.payload[0]
//             }


// // needs lotta work
//         // payload: userSets
//         case NEW_SET:
//             return {
//                 ...state,
//                 items: action.payload,
//                 activeSet: state.items[0]
//             }
//         // payload: {setGuid: setGuid, newName: setName}
//         case EDIT_SET:
//             return {
//                 ...state,
//                 items: state.items.map(t => {
//                     if (t.id === action.payload.teamId)
//                         t.name = action.payload.newName
//                     return t
//                 })
//             }
//         // payload: teamId
//         case DELETE_SET:
//             return {
//                 ...state,
//                 items: state.items.filter(t => t.id != action.payload),
//                 activeSet: null,
//             }      
//         case SET_ACTIVE_SET:
//             return {
//                 ...state,
//                 activeSet: state.items.filter(s => s.set_guid === action.payload)[0] || null,
//             }      
//         default:
//             return state
//     }
// }