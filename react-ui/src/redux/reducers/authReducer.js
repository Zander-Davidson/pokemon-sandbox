import {
    SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    LOGOUT
} from "../actions/types";

const initialState = {
    signingUp: false,
    loggingIn: false,
    isLoggedIn: false,
    username: null,
    icon_url: null
};

export default function (state = initialState, action) {
    switch (action.type) {

        case SIGNUP_REQUEST:
            return {
                ...state,
                signingUp: true,
                isLoggedIn: false
            };

        case SIGNUP_SUCCESS:
            return {
                ...state,
                signingUp: false,
                isLoggedIn: false
            };

        case SIGNUP_FAILURE:
            return {
                ...state,
                signingUp: false,
                isLoggedIn: false
            };

        case LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
                isLoggedIn: false
            };

        case LOGIN_SUCCESS:
            return {
                ...state,
                loggingIn: false,
                isLoggedIn: true,
                username: action.payload.username,
                icon_url: action.payload.icon_url
            };

        case LOGIN_FAILURE:
            return {
                ...state,
                loggingIn: false,
                isLoggedIn: false
            };
        
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null
            }  

        default:
            return state;
    }
}