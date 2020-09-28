import { FETCH_MOVES, FETCH_MOVES_SUCCESS, FETCH_MOVES_FAILURE } from './types'

const API_URL = "/api/move"

export const fetchMoves = () => dispatch => {
    dispatch({
        type: FETCH_MOVES
    })
    fetch(API_URL)
        .then(res => {
            if (!res.ok) {
                dispatch({
                    type: FETCH_MOVES_FAILURE
                })
                throw new Error(`status ${res.status}`);
            }
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_MOVES_SUCCESS,
                payload: json.moves
            })
        })
        .catch(e => {
            dispatch({
                type: FETCH_MOVES_FAILURE
            })
            console.log(`API call failed: ${e}`);
        })
}