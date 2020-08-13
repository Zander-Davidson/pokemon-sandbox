import { FETCH_MOVES, LOADING_MOVES } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_MOVES:
            return {
                ...state,
                fetching: action.payload
            }
        case FETCH_MOVES:
            return {
                ...state,
                items: action.payload,
                fetched: true
            }
        default:
            return state
    }
}