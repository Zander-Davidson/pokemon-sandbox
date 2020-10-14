import { FETCH_POKEMON, FETCH_POKEMON_SUCCESS, FETCH_POKEMON_FAILURE,
        FETCH_POKEMON_NAMES, FETCH_POKEMON_NAMES_FAILURE, FETCH_POKEMON_NAMES_SUCCESS,
        SET_POKEMON_OFFSET, SET_POKEMON_SEARCH,
        ADD_POKEMON_PIN, REMOVE_POKEMON_PIN, CLEAR_POKEMON_PINS
} from './types'

const API_URL_DATA = "/api/pokemon";
const API_URL_NAMES = "/api/pokemon/names";

export const fetchPokemonNames = () => dispatch => {
    dispatch({ type: FETCH_POKEMON_NAMES });

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
    dispatch({ type: FETCH_POKEMON });

    fetch(API_URL_DATA, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.json());
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
                type: FETCH_POKEMON_FAILURE,
                payload: e.message
            })
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

export const addPokemonPin = (name, data) => dispatch => {
    dispatch({
        type: ADD_POKEMON_PIN,
        payload: {
            key: name,
            value: data
        }
    })
}

export const removePokemonPin = (name) => dispatch => {
    dispatch({
        type: REMOVE_POKEMON_PIN,
        payload: { key: name }
    })
}

export const clearPokemonPins = () => dispatch => {
    dispatch({ type: CLEAR_POKEMON_PINS })
}