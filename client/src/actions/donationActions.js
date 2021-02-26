import axios from 'axios';
import {
    GET_DONATION_ADS,
    GET_DONATION_AD,
    ADD_DONATION_AD,
    DELETE_DONATION_AD,
    UPDATE_DONATION_AD
} from './types';

export const getDonationAds = () => {
    return async function (dispatch) {

        const res = await axios.get(`/donationads`)

        return dispatch({
            type: GET_DONATION_ADS,
            payload: res.data
        });
    };
};

export const getOneDonationAd = (id, token) => {
    return async function (dispatch) {

        const res = await axios.get(`/donationads/${id}`, {
            headers: {
                'x-auth-token': token,
            }
        });

        return dispatch({
            type: GET_DONATION_AD,
            payload: res.data.data
        });
    };
};

export const addNewDonationAd = (data, token) => {
    return async function (dispatch) {

        await axios({
            method: 'POST',
            url: `/donationads`,
            data: data,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'x-auth-token': token
            },
        })
            .then(res => dispatch({
                type: ADD_DONATION_AD,
                payload: res.data
            }));

    };
};


export const deleteDonationAd = (id, token) => async (dispatch) => {

    await axios.delete(`/donationads/${id}`, {
        headers: {
            'x-auth-token': token,
        },
    })
        .then(res => dispatch({
            type: DELETE_DONATION_AD,
            payload: res.data,
            param: id
        }))
};

export const updateDonationAd = (id, token, data) => async (dispatch) => {
    axios({
        method: 'PUT',
        url: `/donationads/${id}`,
        data: data,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            'x-auth-token': token
        },
    })
        .then(res =>
            dispatch({
                type: UPDATE_DONATION_AD,
                payload: res.data,
                param: id
            })
        )
};