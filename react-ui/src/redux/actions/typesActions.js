import { FETCH_TYPES, FETCH_TYPES_SUCCESS, FETCH_TYPES_FAILURE} from './types'

const API_URL_DATA = "/api/type"

export const fetchTypes = (searchParams) => dispatch => {
dispatch({
    type: FETCH_TYPES
})
fetch(API_URL_DATA)
    .then(res => {
        if (!res.ok) {
            dispatch({
                type: FETCH_TYPES_FAILURE
            })
            throw new Error(`status ${res.status}`);
        }
        return res.json();
    })
    .then(json => {
        dispatch({
            type: FETCH_TYPES_SUCCESS,
            payload: json.types
        })
    })
    .catch(e => {
        dispatch({
            type: FETCH_TYPES_FAILURE
        })
        console.log(`API call failed: ${e}`);
    })
}