import { FETCH_POKEMONS, LOADING_POKEMONS } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetching: false,
    fetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_POKEMONS:
            return {
                ...state,
                fetching: action.payload
            }
        case FETCH_POKEMONS:
            return {
                ...state,
                items: action.payload,
                fetched: true
            }
        default:
            return state
    }
}