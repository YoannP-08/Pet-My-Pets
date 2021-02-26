import axios from 'axios';
import { returnErrors } from './errorActions';
import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGIN_GOOGLE_SUCCESS,
    USER_DELETE_ACCOUNT,
    USER_UPDATE_ACCOUNT
} from "./types";
import Swal from 'sweetalert2';


const openSweetAlertOk = (message) => {
    Swal.fire({
        title: 'Success',
        text: 'Welcome ' + message.payload.user.username,
        icon: "success",
        confirmButtonText: "Ok",
    }).then((result) => {
        if (result.isConfirmed) {
            // document.location.reload();
            
        }
    })
}

const openSweetAlertError = (message) => {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: "error",
    })
}

const openSweetAlertLogout = () => {
    Swal.fire({
        title: 'Success',
        text: "You have been successfully logout",
        icon: "success",
    })
}


const openSweetAlertUserDeleteAccount = () => {
    Swal.fire({
        title: 'Success',
        text: 'Your account has been deleted successfully.',
        icon: 'success'
    })
}


// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });

    axios.get('/users/auth/info', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
}


//Register User
export const register = ({ firstname, lastname, username, email, password, address, zipCode, city, isAdmin }) => dispatch => {
    //Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({ firstname, lastname, username, email, password, address, zipCode, city, isAdmin });

    axios.post('/users/signup', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        ).then(res => openSweetAlertOk(res))
        .catch(err => {
            openSweetAlertError(err.response.data.message)
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({
                type: REGISTER_FAIL
            })
        })
}
//Login User
//export const login = async 
export const login = ({ email, password }) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({ email, password });

    axios.post('/users/signin', body, config)
        .then(res =>
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        ).then(res => openSweetAlertOk(res))
        .catch(err => {
            openSweetAlertError(err.response.data.message)
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            })
        })
}

export const login_google = () => dispatch => {
    dispatch({
        type: LOGIN_GOOGLE_SUCCESS
    })
}


//Logout User
export const logout = () => {
    openSweetAlertLogout()
    return {
        type: LOGOUT_SUCCESS
    }
}

//User Delete User Account
export const userDeleteAccount = () => {
    openSweetAlertUserDeleteAccount();
    return {
        type: USER_DELETE_ACCOUNT
    };
};

//User Update User Account
export const userUpdateAccount = ({ firstname, lastname, email, address, city, zipCode, token, userId }) => async (dispatch) => {
    // Request Body
    const body = { firstname, lastname, email, address, city, zipCode };

    await axios({
        method: 'patch',
        url: `/users/${userId}`,
        headers: {
            'x-auth-token': token,
        },
        data: body
    })
        .then(res =>
            dispatch({
                type: USER_UPDATE_ACCOUNT,
                payload: {
                    token: token,
                    user: {
                        id: res.data.user._id,
                        firstname: res.data.user.firstname,
                        lastname: res.data.user.lastname,
                        username: res.data.user.username,
                        email: res.data.user.email,
                        address: res.data.user.address,
                        zipCode: res.data.user.zipCode,
                        city: res.data.user.city,
                        isAdmin: res.data.user.isAdmin
                    }
                }
            })
        );
};


//Setup config/headers and token
export const tokenConfig = getState => {
    // get token from localstorage
    //const token = getState().auth.token;
    const token = getState().auth.userDetails.token;
    // headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    // if token, add to headers
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}


