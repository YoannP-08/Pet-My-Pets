import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_GOOGLE_SUCCESS,
    USER_DELETE_ACCOUNT,
    USER_UPDATE_ACCOUNT
} from "../actions/types";

const initialState = {
    isAuthenticated: null,
    isLoading: false,
    userDetails: JSON.parse(localStorage.getItem('user'))
};

// eslint-disable-next-line
export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false
            };
        case LOGIN_GOOGLE_SUCCESS:
            if ("user" in localStorage) {
                return {
                    ...state,
                    isAuthenticated: true,
                    isLoading: false
                }
            }
            else {
                return {
                    ...state,
                    isAuthenticated: false,
                    isLoading: false
                }
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
                userDetails: JSON.parse(localStorage.getItem('user'))
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case USER_DELETE_ACCOUNT:
        case REGISTER_FAIL:
            // localStorage.removeItem('userDetails');
            localStorage.removeItem('user');
            return {
                ...state,
                userDetails: null,
                isAuthenticated: false,
                isLoading: false,
            }
        case USER_UPDATE_ACCOUNT:
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                ...state,
                userDetails: '',
                // eslint-disable-next-line no-dupe-keys
                userDetails: JSON.parse(localStorage.getItem('user'))
            }
        default:
            return state;
    }
}