import {
    SIGNUP_REQUEST, SIGNUP_SUCCESS, SIGNUP_FAILURE,
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    LOGOUT,
    SET_MESSAGE
} from "./types";
import authService from "../../services/authService";
import jwt_decode from "jwt-decode";

export const checkLoggedIn = () => (dispatch) => {
    dispatch({
        type: LOGIN_REQUEST
    });

    let current_time = new Date().getTime() / 1000;
    let user = JSON.parse(localStorage.getItem("user"));

    if (user && user.accessToken) {
        var jwt = jwt_decode(user.accessToken);
    } else {
        // no access token present
        dispatch({
            type: LOGIN_FAILURE
        });
        return;
    }

    if (current_time < jwt.exp) {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                username: jwt.username,
                icon_url: jwt.icon_url
            }
        });        
    } else {
        // JWT is expired
        dispatch({
            type: LOGIN_FAILURE
        });
    }
}

export const signup = (username, email, icon_name, password) => (dispatch) => {
    dispatch({
        type: SIGNUP_REQUEST
    });

    return authService.signup(username, email, icon_name, password).then(
        (response) => {
            dispatch({
                type: SIGNUP_SUCCESS,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: response.data.message,
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: SIGNUP_FAILURE,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const login = (username, password) => (dispatch) => {
    dispatch({
        type: LOGIN_REQUEST
    });

    return authService.login(username, password).then(
        (data) => {
            let user = JSON.parse(localStorage.getItem("user"));
            let jwt = jwt_decode(user.accessToken);

            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    username: jwt.username,
                    icon_url: jwt.icon_url
                },
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: LOGIN_FAILURE,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const logout = () => (dispatch) => {
    authService.logout();

    dispatch({
        type: LOGOUT,
    });
};