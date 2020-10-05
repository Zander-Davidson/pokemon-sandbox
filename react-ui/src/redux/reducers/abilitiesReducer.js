import { FETCH_ABILITIES, FETCH_ABILITIES_FAILURE, FETCH_ABILITIES_SUCCESS,
    FETCH_ABILITY_NAMES, FETCH_ABILITY_NAMES_FAILURE, FETCH_ABILITY_NAMES_SUCCESS
} from '../actions/types'

const initialState = {
    abilityNames: [],
    abilityData: [],
    fetchingAbilities: false,
    fetchedAbilities: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_ABILITY_NAMES:
            return {
                ...state,
                // fetchingAbilities: true
            }

        case FETCH_ABILITY_NAMES_SUCCESS:
            return {
                ...state,
                abilityNames: action.payload,
                // fetchedAbilities: true,
                // fetchingAbilities: false
            }

        case FETCH_ABILITY_NAMES_FAILURE:
            return {
                ...state,
                // fetchingAbilities: false,
                // fetchedAbilities: false
            }

        case FETCH_ABILITIES:
            return {
                ...state,
                fetchingAbilities: true
            }

        case FETCH_ABILITIES_SUCCESS:
            return {
                ...state,
                abilityData: action.payload,
                fetchedAbilities: true,
                fetchingAbilities: false
            }

        case FETCH_ABILITIES_FAILURE:
            return {
                ...state,
                fetchingAbilities: false,
                fetchedAbilities: false
            }
        default:
            return state
    }
}