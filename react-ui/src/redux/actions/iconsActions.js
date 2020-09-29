import { FETCH_ICONS, FETCH_ICONS_SUCCESS, FETCH_ICONS_FAILURE } from './types'

const API_URL = "/api/icon"

export const fetchIcons = () => dispatch => {
    dispatch({
        type: FETCH_ICONS
    })
    fetch(API_URL)
        .then(res => {
            if (!res.ok) {
                dispatch({
                    type: FETCH_ICONS_FAILURE
                })
                throw new Error(`status ${res.status}`);
            }
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_ICONS_SUCCESS,
                payload: json.icons
            })
        })
        .catch(e => {
            dispatch({
                type: FETCH_ICONS_FAILURE
            })
            console.log(`API call failed: ${e}`);
        })
}