import { FETCH_POKEMON, FETCH_POKEMON_SUCCESS, FETCH_POKEMON_FAILURE } from './types'

const API_URL = "/api/pokemon"

export const fetchPokemon = () => dispatch => {
    dispatch({
        type: FETCH_POKEMON
    })
    fetch(API_URL)
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
                payload: json.pokemon
            })
        })
        .catch(e => {
            dispatch({
                type: FETCH_POKEMON_FAILURE
            })
            console.log(`API call failed: ${e}`);
        })
}