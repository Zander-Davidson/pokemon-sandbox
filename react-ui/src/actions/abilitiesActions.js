import { FETCH_ABILITIES, LOADING_ABILITIES } from './types'

const fetchAbilitiesUrl = "/api/getAllAbilities"

export const fetchAbilities = () => dispatch => {
    dispatch({
        type: LOADING_ABILITIES,
        payload: true
    })
    fetch(fetchAbilitiesUrl)
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        return res.json();
    })
    .then(abilities => {
        dispatch({
            type: FETCH_ABILITIES,
            payload: abilities.results
        })
        dispatch({
            type: LOADING_ABILITIES,
            payload: false
        })
    })
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}