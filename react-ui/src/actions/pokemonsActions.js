import { FETCH_POKEMONS, LOADING_POKEMONS } from './types'

const fetchPokemonUrl = "/api/pokemon"

export const fetchPokemons = () => dispatch => {
    dispatch({
        type: LOADING_POKEMONS,
        payload: true
    })
    fetch(fetchPokemonUrl)
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        return res.json();
    })
    .then(json => {
        dispatch({
            type: FETCH_POKEMONS,
            payload: json.pokemon
        })
        dispatch({
            type: LOADING_POKEMONS,
            payload: false
        })
    })
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}