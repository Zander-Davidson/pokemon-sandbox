import { FETCH_NATURES, LOADING_NATURES } from '../actions/types'

const initialState = {
    natures: null,
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
                natures: action.payload,
                fetched: true
            }
        default:
            return state
    }
}