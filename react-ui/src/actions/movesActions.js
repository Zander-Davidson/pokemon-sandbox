import { FETCH_MOVES, LOADING_MOVES } from './types'

const fetchMovesUrl = "/api/move"

export const fetchMoves = () => dispatch => {
    dispatch({
        type: LOADING_MOVES,
        payload: true
    })
    fetch(fetchMovesUrl)
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        return res.json();
    })
    .then(json => {
        dispatch({
            type: FETCH_MOVES,
            payload: json.move
        })
        dispatch({
            type: LOADING_MOVES,
            payload: false
        })
    })
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}