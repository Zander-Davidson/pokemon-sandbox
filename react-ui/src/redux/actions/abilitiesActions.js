import { FETCH_ABILITIES, FETCH_ABILITIES_SUCCESS, FETCH_ABILITIES_FAILURE,
    FETCH_ABILITY_NAMES, FETCH_ABILITY_NAMES_FAILURE, FETCH_ABILITY_NAMES_SUCCESS
} from './types'

const API_URL_DATA = "/api/ability";
const API_URL_NAMES = "/api/ability/names";

export const fetchAbilityNames = () => dispatch => {
dispatch({
    type: FETCH_ABILITY_NAMES
})
fetch(API_URL_NAMES)
    .then(res => {
        if (!res.ok) {
            dispatch({
                type: FETCH_ABILITY_NAMES_FAILURE
            })
            throw new Error(`status ${res.status}`);
        }
        return res.json();
    })
    .then(json => {
        dispatch({
            type: FETCH_ABILITY_NAMES_SUCCESS,
            payload: json.abilityNames
        })
    })
    .catch(e => {
        dispatch({
            type: FETCH_ABILITY_NAMES_FAILURE
        })
        console.log(`API call failed: ${e}`);
    })
}


export const fetchAbilities = (searchParams) => dispatch => {
dispatch({
    type: FETCH_ABILITIES
})
fetch(API_URL_DATA, {
    method: 'GET',
    body: searchParams
})
    .then(res => {
        if (!res.ok) {
            dispatch({
                type: FETCH_ABILITIES_FAILURE
            })
            throw new Error(`status ${res.status}`);
        }
        return res.json();
    })
    .then(json => {
        dispatch({
            type: FETCH_ABILITIES_SUCCESS,
            payload: json.abilities
        })
    })
    .catch(e => {
        dispatch({
            type: FETCH_ABILITIES_FAILURE
        })
        console.log(`API call failed: ${e}`);
    })
}