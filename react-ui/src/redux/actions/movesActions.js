import { FETCH_MOVES, FETCH_MOVES_SUCCESS, FETCH_MOVES_FAILURE,
    FETCH_MOVE_NAMES, FETCH_MOVE_NAMES_FAILURE, FETCH_MOVE_NAMES_SUCCESS
} from './types'

const API_URL_DATA = "/api/move"
const API_URL_NAMES = "/api/move/names"

export const fetchMoveNames = () => dispatch => {
dispatch({
    type: FETCH_MOVE_NAMES
})
fetch(API_URL_NAMES)
    .then(res => {
        if (!res.ok) {
            dispatch({
                type: FETCH_MOVE_NAMES_FAILURE
            })
            throw new Error(`status ${res.status}`);
        }
        return res.json();
    })
    .then(json => {
        dispatch({
            type: FETCH_MOVE_NAMES_SUCCESS,
            payload: json.moveNames
        })
    })
    .catch(e => {
        dispatch({
            type: FETCH_MOVE_NAMES_FAILURE
        })
        console.log(`API call failed: ${e}`);
    })
}


export const fetchMoves = (searchParams) => dispatch => {
dispatch({
    type: FETCH_MOVES,
})
fetch(API_URL_DATA, {
    method: 'POST',
    body: searchParams
})
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
            payload: json.move
        })
    })
    .catch(e => {
        dispatch({
            type: FETCH_MOVES_FAILURE
        })
        console.log(`API call failed: ${e}`);
    })
}