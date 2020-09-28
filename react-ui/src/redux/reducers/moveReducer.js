import { FETCH_MOVES, FETCH_MOVES_FAILURE, FETCH_MOVES_SUCCESS } from '../actions/types'

const initialState = {
    items: [],
    item: {},
    fetchingMoves: false,
    movesFetched: false
}

export default function(state = initialState, action) {
    switch(action.type) {

        case FETCH_MOVES:
            return {
                ...state,
                fetchingMoves: true
            }

        case FETCH_MOVES_SUCCESS:
            return {
                ...state,
                items: action.payload,
                movesFetched: true,
                fetchingMoves: false
            }

        case FETCH_MOVES_FAILURE:
            return {
                ...state,
                fetchingMoves: false,
                movesFetched: false
            }

        default:
            return state
    }
}