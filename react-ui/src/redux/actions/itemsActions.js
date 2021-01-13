import { FETCH_ITEMS, LOADING_ITEMS, FETCH_ITEM_NAMES, FETCH_ITEM_NAMES_FAILURE, FETCH_ITEM_NAMES_SUCCESS } from './types'

const fetchItemsUrl = "/api/getAllItems"
const API_URL_NAMES = "/api/item/names";

export const fetchItemNames = () => dispatch => {
    dispatch({ type: FETCH_ITEM_NAMES });

    fetch(API_URL_NAMES)
        .then(res => {
            if (!res.ok) {
                dispatch({
                    type: FETCH_ITEM_NAMES_FAILURE
                })
                throw new Error(`status ${res.status}`);
            }
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_ITEM_NAMES_SUCCESS,
                payload: json.itemNames
            })
        })
        .catch(e => {
            dispatch({
                type: FETCH_ITEM_NAMES_FAILURE
            })
            console.log(`API call failed: ${e}`);
        })
}

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