import { UPDATE_WINDOW_SIZE } from './types'

export const updateWindowSize = (width, height) => dispatch => {
    console.log(width)
    dispatch({ 
        type: UPDATE_WINDOW_SIZE,
        payload: {
            width: width,
            height: height
        }
    });
};