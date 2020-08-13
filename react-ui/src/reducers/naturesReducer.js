import { FETCH_NATURES, LOADING_NATURES } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_NATURES:
            return {
                ...state,
                fetching: action.payload
            }
        case FETCH_NATURES:
            return {
                ...state,
                items: action.payload,
                fetched: true
            }
        default:
            return state
    }
}