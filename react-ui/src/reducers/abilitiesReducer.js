import { FETCH_ABILITIES, LOADING_ABILITIES } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_ABILITIES:
            return {
                ...state,
                fetching: action.payload
            }
        case FETCH_ABILITIES:
            return {
                ...state,
                items: action.payload,
                fetched: true
            }
        default:
            return state
    }
}