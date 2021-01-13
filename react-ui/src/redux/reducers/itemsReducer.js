import { FETCH_ITEMS, LOADING_ITEMS, FETCH_ITEM_NAMES, FETCH_ITEM_NAMES_FAILURE, FETCH_ITEM_NAMES_SUCCESS } from '../actions/types'

const initialState = {
    itemNames: [],
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        
        case FETCH_ITEM_NAMES:
            return {
                ...state,
                // fetchingItems: true
            }

        case FETCH_ITEM_NAMES_SUCCESS:
            return {
                ...state,
                itemNames: action.payload,
                // fetchedItems: true,
                // fetchingItems: false
            }

        case FETCH_ITEM_NAMES_FAILURE:
            return {
                ...state,
                // fetchingItems: false,
                // fetchedItems: false
            }

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