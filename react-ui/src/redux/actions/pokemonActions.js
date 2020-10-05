import { FETCH_POKEMON, FETCH_POKEMON_SUCCESS, FETCH_POKEMON_FAILURE,
        FETCH_POKEMON_NAMES, FETCH_POKEMON_NAMES_FAILURE, FETCH_POKEMON_NAMES_SUCCESS,
        SET_POKEMON_OFFSET, SET_POKEMON_SEARCH
} from './types'

const API_URL_DATA = "/api/pokemon";
const API_URL_NAMES = "/api/pokemon/names";

export const fetchPokemonNames = () => dispatch => {
    dispatch({
        type: FETCH_POKEMON_NAMES
    })
    fetch(API_URL_NAMES)
        .then(res => {
            if (!res.ok) {
                dispatch({
                    type: FETCH_POKEMON_NAMES_FAILURE
                })
                throw new Error(`status ${res.status}`);
            }
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_POKEMON_NAMES_SUCCESS,
                payload: json.pokemonNames
            })
        })
        .catch(e => {
            dispatch({
                type: FETCH_POKEMON_NAMES_FAILURE
            })
            console.log(`API call failed: ${e}`);
        })
}

export const fetchPokemon = (searchParams) => dispatch => {
    dispatch({
        type: FETCH_POKEMON
    })
    fetch(API_URL_DATA, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
    })
        .then(res => {
            if (!res.ok) {
                dispatch({
                    type: FETCH_POKEMON_FAILURE
                })
                throw new Error(`status ${res.status}`);
            }
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_POKEMON_SUCCESS,
                payload: {
                    pokemon: json.pokemon,
                    total: json.total,
                    searchParams: searchParams
                }
            })
        })
        .catch(e => {
            dispatch({
                type: FETCH_POKEMON_FAILURE
            })
            console.log(`API call failed: ${e}`);
        })
}

export const setPokemonOffset = (offset) => dispatch => {
    dispatch({
        type: SET_POKEMON_OFFSET,
        payload: offset
    });
}

export const setPokemonSearch = (searchParams) => dispatch => {
    dispatch({
        type: SET_POKEMON_SEARCH,
        payload: searchParams
    });
}