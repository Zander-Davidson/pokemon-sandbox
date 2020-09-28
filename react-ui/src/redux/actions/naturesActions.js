import { FETCH_NATURES, LOADING_NATURES } from './types'

const fetchNaturesUrl = "/api/getAllNatures"

export const fetchNatures = () => dispatch => {
    dispatch({
        type: LOADING_NATURES,
        payload: true
    })
    fetch(fetchNaturesUrl)
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        return res.json();
    })
    .then(natures => {
        dispatch({
            type: FETCH_NATURES,
            payload: natures.results
        })
        dispatch({
            type: LOADING_NATURES,
            payload: false
        })
    })
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}