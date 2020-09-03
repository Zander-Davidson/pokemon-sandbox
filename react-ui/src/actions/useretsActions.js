import { FETCH_SETS, LOADING_SETS, NEW_SET } from './types'


const endpoint = '/api/user/get-user-sets-by-team/';

export const fetchUserSets = (teamGuid) => dispatch => {
    dispatch({
        type: LOADING_SETS,
        payload: true
    })
    fetch(endpoint + teamGuid)
        .then(res => {
            if (!res.ok)
                throw new Error(`status ${res.status}`);
            return res.json();
        })
        .then(json => {
            dispatch({
                type: FETCH_SETS,
                payload: json.user_sets
            })
            dispatch({
                type: LOADING_SETS,
                payload: false
            })
        })
        .catch(e => {
            console.log(`API call failed: ${e}`);
        })
}


// export const createUserset = (setData) => dispatch => {
//     dispatch({
//         type: NEW_SET
//     })
//     fetch('https://jsonplaceholder.typicode.com/posts', {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify(postData)
//     })
//     .then(res => res.json())
//     .then(post => dispatch({
//         type: NEW_POST,
//         payload: post
//     }))
// }