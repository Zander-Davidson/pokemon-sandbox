import { FETCH_ITEMS, LOADING_ITEMS } from './types'

const fetchItemsUrl = "/api/getAllItems"

export const fetchItems = () => dispatch => {
    dispatch({
        type: LOADING_ITEMS,
        payload: true
    })
    fetch(fetchItemsUrl)
    .then(res => {
        if (!res.ok)
            throw new Error(`status ${res.status}`);
        return res.json();
    })
    .then(items => {
        dispatch({
            type: FETCH_ITEMS,
            payload: items.results
        })
        dispatch({
            type: LOADING_ITEMS,
            payload: false
        })
    })
    .catch(e => {
        console.log(`API call failed: ${e}`);
    })
}