import {
    FETCH_MOVES, FETCH_MOVES_FAILURE, FETCH_MOVES_SUCCESS,
    FETCH_MOVE_NAMES, FETCH_MOVE_NAMES_FAILURE, FETCH_MOVE_NAMES_SUCCESS,
    FETCH_DAMAGE_CLASS_NAMES, FETCH_DAMAGE_CLASS_NAMES_FAILURE, FETCH_DAMAGE_CLASS_NAMES_SUCCESS,
    SET_MOVE_OFFSET, SET_MOVE_SEARCH
} from '../actions/types'

const initialState = {
    moveNames: [],
    damageClassNames: [],
    moveData: [],
    pinnedMoves: [],
    fetchingMoves: false,
    fetchedMoves: false,
    total: null,
    offset: 0,
    limit: 50,
    searchParams: {
        sortOrder: 'asc',
        sortBy: 'game_id',
        hasNames: [],
        hasTypes: [],
        hasDamageClass: [],
        hasPokemon: [],
        strictPokemon: true,
    }
}

export default function (state = initialState, action) {
    switch (action.type) {

        case FETCH_MOVE_NAMES:
            return {
                ...state,
                // fetchingMoves: true
            }

        case FETCH_MOVE_NAMES_SUCCESS:
            return {
                ...state,
                moveNames: action.payload,
                // fetchedMoves: true,
                // fetchingMoves: false
            }

        case FETCH_MOVE_NAMES_FAILURE:
            return {
                ...state,
                // fetchingMoves: false,
                // fetchedMoves: false
            }

        case FETCH_DAMAGE_CLASS_NAMES:
            return {
                ...state,
                // fetchingMoves: true
            }

        case FETCH_DAMAGE_CLASS_NAMES_SUCCESS:
            return {
                ...state,
                damageClassNames: action.payload,
                // fetchedMoves: true,
                // fetchingMoves: false
            }

        case FETCH_DAMAGE_CLASS_NAMES_FAILURE:
            return {
                ...state,
                // fetchingMoves: false,
                // fetchedMoves: false
            }

        case FETCH_MOVES:
            return {
                ...state,
                fetchingMoves: true
            }

        case FETCH_MOVES_SUCCESS:
            return {
                ...state,
                moveData: action.payload.moves,
                total: state.total != action.payload.total ? action.payload.total : state.total,
                fetchedMoves: true,
                fetchingMoves: false
            }

        case FETCH_MOVES_FAILURE:
            return {
                ...state,
                fetchingMoves: false,
                fetchedMoves: false,
                total: 0
            }

        case SET_MOVE_OFFSET:
            return {
                ...state,
                offset: action.payload
            }

        case SET_MOVE_SEARCH:
            return {
                ...state,
                searchParams: action.payload
            }

        default:
            return state
    }
}