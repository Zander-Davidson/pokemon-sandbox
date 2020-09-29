import { FETCH_MOVES, FETCH_MOVES_FAILURE, FETCH_MOVES_SUCCESS } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {

        case FETCH_MOVES:
            return {
                ...state,
                fetching: true
            }

        case FETCH_MOVES_SUCCESS:
            return {
                ...state,
                items: action.payload,
                fetched: true,
                fetching: false
            }

        case FETCH_MOVES_FAILURE:
            return {
                ...state,
                fetching: false,
                fetched: false
            }

        default:
            return state
    }
}