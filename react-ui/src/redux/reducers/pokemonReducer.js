import { FETCH_POKEMON, FETCH_POKEMON_FAILURE, FETCH_POKEMON_SUCCESS } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_POKEMON:
            return {
                ...state,
                fetching: true
            }

        case FETCH_POKEMON_SUCCESS:
            return {
                ...state,
                items: action.payload,
                fetched: true,
                fetching: false
            }

        case FETCH_POKEMON_FAILURE:
            return {
                ...state,
                fetching: false,
                fetched: false
            }

        default:
            return state
    }            
}