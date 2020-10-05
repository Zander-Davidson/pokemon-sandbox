import { FETCH_TYPES, FETCH_TYPES_FAILURE, FETCH_TYPES_SUCCESS
} from '../actions/types'

const initialState = {
    typeData: [],
    fetchingTypes: false,
    fetchedTypes: false
}

export default function(state = initialState, action) {
switch(action.type) {

    case FETCH_TYPES:
        return {
            ...state,
            fetchingTypes: true
        }

    case FETCH_TYPES_SUCCESS:
        return {
            ...state,
            typeData: action.payload,
            fetchedTypes: true,
            fetchingTypes: false
        }

    case FETCH_TYPES_FAILURE:
        return {
            ...state,
            fetchingTypes: false,
            fetchedTypes: false
        }

    default:
        return state
}
}