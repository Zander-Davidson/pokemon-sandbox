import { FETCH_POKEMON, FETCH_POKEMON_FAILURE, FETCH_POKEMON_SUCCESS,
         FETCH_POKEMON_NAMES, FETCH_POKEMON_NAMES_FAILURE, FETCH_POKEMON_NAMES_SUCCESS,
         SET_POKEMON_OFFSET, SET_POKEMON_SEARCH
} from '../actions/types'

const initialState = {
    pokemonNames: [],
    pokemonData: [],
    pinnedPokemon: [],
    fetchingPokemon: false,
    fetchedPokemon: false,
    total: null,
    offset: 0,
    limit: 50,
    searchParams: {
        sortOrder: 'asc',
        sortBy: 'game_id',
        hasNames: [],
        hasTypes: [],
        strictTypes: false,
        hasAbilities: [],
        hasMoves: [],
        strictMoves: true,
    }
}

export default function(state = initialState, action) {
    switch(action.type) {

        case FETCH_POKEMON_NAMES:
            return {
                ...state,
                // fetchingPokemon: true
            }

        case FETCH_POKEMON_NAMES_SUCCESS:
            return {
                ...state,
                pokemonNames: action.payload,
                // fetchedPokemon: true,
                // fetchingPokemon: false
            }

        case FETCH_POKEMON_NAMES_FAILURE:
            return {
                ...state,
                // fetchingPokemon: false,
                // fetchedPokemon: false
            }

        case FETCH_POKEMON:
            return {
                ...state,
                fetchingPokemon: true
            }

        case FETCH_POKEMON_SUCCESS:
            return {
                ...state,
                pokemonData: action.payload.pokemon,
                total: state.total != action.payload.total ? action.payload.total : state.total,
                fetchedPokemon: true,
                fetchingPokemon: false
            }

        case FETCH_POKEMON_FAILURE:
            return {
                ...state,
                fetchingPokemon: false,
                fetchedPokemon: false,
                total: 0
            }
        
        case SET_POKEMON_OFFSET:
            return {
                ...state,
                offset: action.payload
            }

        case SET_POKEMON_SEARCH:
            return {
                ...state,
                searchParams: action.payload
            }

        default:
            return state
    }            
}