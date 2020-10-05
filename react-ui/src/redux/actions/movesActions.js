import { FETCH_MOVES, FETCH_MOVES_SUCCESS, FETCH_MOVES_FAILURE,
    FETCH_MOVE_NAMES, FETCH_MOVE_NAMES_FAILURE, FETCH_MOVE_NAMES_SUCCESS,
    FETCH_DAMAGE_CLASS_NAMES, FETCH_DAMAGE_CLASS_NAMES_FAILURE, FETCH_DAMAGE_CLASS_NAMES_SUCCESS,
    SET_MOVE_OFFSET, SET_MOVE_SEARCH
} from './types'

const API_URL_DATA = "/api/move";
const API_URL_NAMES = "/api/move/names";
const API_URL_DAMAGE_CLASS_NAMES = "/api/move/damageclassnames";


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

export const fetchDamageClassNames = () => dispatch => {
    dispatch({
        type: FETCH_DAMAGE_CLASS_NAMES
    })
    fetch(API_URL_DAMAGE_CLASS_NAMES)
        .then(res => {
            if (!res.ok) {
                dispatch({
                    type: FETCH_DAMAGE_CLASS_NAMES_FAILURE
                })
                throw new Error(`status ${res.status}`);
            }
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_DAMAGE_CLASS_NAMES_SUCCESS,
                payload: json.damageClassNames
            })
        })
        .catch(e => {
            dispatch({
                type: FETCH_DAMAGE_CLASS_NAMES_FAILURE
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
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchParams)
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
            payload: {
                moves: json.moves,
                total: json.total,
                searchParams: searchParams
            }
        })
    })
    .catch(e => {
        dispatch({
            type: FETCH_MOVES_FAILURE
        })
        console.log(`API call failed: ${e}`);
    })
}

export const setMoveOffset = (offset) => dispatch => {
    dispatch({
        type: SET_MOVE_OFFSET,
        payload: offset
    });
}

export const setMoveSearch = (searchParams) => dispatch => {
    dispatch({
        type: SET_MOVE_SEARCH,
        payload: searchParams
    });
}