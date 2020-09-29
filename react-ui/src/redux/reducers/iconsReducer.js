import { FETCH_ICONS, FETCH_ICONS_SUCCESS, FETCH_ICONS_FAILURE } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {

        case FETCH_ICONS:
            return {
                ...state,
                fetching: true
            }

        case FETCH_ICONS_SUCCESS:
            return {
                ...state,
                items: action.payload,
                fetched: true,
                fetching: false
            }

        case FETCH_ICONS_FAILURE:
            return {
                ...state,
                fetched: false,
                fetching: false
            }

        default:
            return state
    }
}