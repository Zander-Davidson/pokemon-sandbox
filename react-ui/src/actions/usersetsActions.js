import { FETCH_USERSETS, LOADING_USERSETS, NEW_USERSET } from './types'

export const createUserset = (setData) => dispatch => {
    dispatch({
        type: NEW_USERSET
    })
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(post => dispatch({
        type: NEW_POST,
        payload: post
    }))
}