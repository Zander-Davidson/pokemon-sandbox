import { FETCH_MOVES, FETCH_MOVES_FAILURE, FETCH_MOVES_SUCCESS,
        FETCH_MOVE_NAMES, FETCH_MOVE_NAMES_FAILURE, FETCH_MOVE_NAMES_SUCCESS
} from '../actions/types'

const initialState = {
    moveNames: [],
    moveData: [],
    pinnedMoves: [],
    fetchingMoves: false,
    fetchedMoves: false
}

export default function(state = initialState, action) {
    switch(action.type) {

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

        case FETCH_MOVES:
            return {
                ...state,
                fetchingMoves: true
            }

        case FETCH_MOVES_SUCCESS:
            return {
                ...state,
                moveData: action.payload,
                fetchedMoves: true,
                fetchingMoves: false
            }

        case FETCH_MOVES_FAILURE:
            return {
                ...state,
                fetchingMoves: false,
                fetchedMoves: false
            }

        default:
            return state
    }
}