import {
    GET_KEEPER_ADS,
    GET_KEEPER_AD,
    ADD_KEEPER_AD,
    DELETE_KEEPER_AD,
    UPDATE_KEEPER_AD
} from './types';
import axios from 'axios';

export const getKeeperAds = () => {
    return async function (dispatch) {

        const res = await axios.get(`/keeperads`);

        return dispatch({
            type: GET_KEEPER_ADS,
            payload: res.data.data
        });
    };
};

export const getOneKeeperAd = (id, token) => {
    return async function (dispatch) {

        const res = await axios.get(`/keeperads/${id}`, {
            headers: {
                'x-auth-token': token
            }
        });

        return dispatch({
            type: GET_KEEPER_AD,
            payload: res.data.data
        })
    };
};

export const addNewKeeperAd = (data, token) => {
    return async function (dispatch) {

        axios({
            method: 'POST',
            url: `/keeperads`,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'x-auth-token': token,
            },
            data: data
        })
        .then(res => dispatch({
            type: ADD_KEEPER_AD,
            payload: res.data.data
        }));
    };
};

export const deleteKeeperAd = (id, token) => async (dispatch) => {
    await axios.delete(`/keeperads/${id}`, {
        headers: {
            'x-auth-token': token,
        },
    })
    .then (res => dispatch({
        type: DELETE_KEEPER_AD,
        payload: res.data.data,
        param: id
    }))
};

export const updateKeeperAd = (id, token, data) => async (dispatch) => {
    axios({
        method: 'PUT',
        url: `/keeperads/${id}`,
        data: data,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            'x-auth-token': token
        },
    })
    .then(res =>
        dispatch({
            type: UPDATE_KEEPER_AD,
            payload: res.data.data,
            param: id
        })
    )
};