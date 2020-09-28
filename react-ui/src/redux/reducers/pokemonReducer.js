import { FETCH_POKEMON, FETCH_POKEMON_FAILURE, FETCH_POKEMON_SUCCESS } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetchingPokemon: false,
    pokemonFetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_POKEMON:
            return {
                ...state,
                fetchingPokemon: true
            }

        case FETCH_POKEMON_SUCCESS:
            return {
                ...state,
                items: action.payload,
                pokemonFetched: true,
                fetchingPokemon: false
            }

        case FETCH_POKEMON_FAILURE:
            return {
                ...state,
                fetchingPokemon: false,
                pokemonFetched: false
            }

        default:
            return state
    }            
}