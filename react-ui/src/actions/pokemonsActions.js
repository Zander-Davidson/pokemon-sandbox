import { FETCH_POKEMONS, LOADING_POKEMONS } from './types'

const fetchPokesUrl = "/api/getAllPokemon"

export const fetchPokemons = () => dispatch => {
    console.log('pokemon action')
    dispatch({
        type: LOADING_POKEMONS,
        payload: true
    })
    fetch(fetchPokesUrl)
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        return res.json();
    })
    .then(pokemons => {
        dispatch({
            type: FETCH_POKEMONS,
            payload: pokemons.results
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