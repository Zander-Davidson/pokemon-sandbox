import { FETCH_ITEMS, LOADING_ITEMS } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_ITEMS:
            return {
                ...state,
                fetching: action.payload
            }
        case FETCH_ITEMS:
            return {
                ...state,
                items: action.payload,
                fetched: true
            }
        default:
            return state
    }
}