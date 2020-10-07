import { UPDATE_WINDOW_SIZE } from '../actions/types'

const mobileMaxWidth = 800;

const initialState = {
    windowHeight: 0,
    windowWidth: 0,
    isMobile: false
}

export default function(state = initialState, action) {
    switch(action.type) {

        case UPDATE_WINDOW_SIZE:
            let isMobile = action.payload.width <= mobileMaxWidth;
            return {
                ...state,
                height: action.payload.height,
                width: action.payload.width,
                isMobile: isMobile,
            }

        default:
            return state
    }
}