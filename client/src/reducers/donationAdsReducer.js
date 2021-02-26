import {
    GET_DONATION_ADS,
    GET_DONATION_AD,
    ADD_DONATION_AD,
    DELETE_DONATION_AD,
    UPDATE_DONATION_AD
} from '../actions/types';

const initialState = {
    donationAds: [],
    donationAd: {},
}

const donationAdsReducer = (state = initialState, action) => {
    const { type, payload, param } = action;

    switch (type) {
        case GET_DONATION_ADS:
            return {
                ...state,
                donationAds: payload, //res.data
            }
        case GET_DONATION_AD:
            return {
                ...state,
                donationAd: payload, //res.data
            }
        case ADD_DONATION_AD:
            console.log('Reducer', payload)
            return {
                ...state,
                donationAds: [payload.data, ...state.donationAds,]
            }
        case DELETE_DONATION_AD:
            return {
                ...state, 
                donationAds: state.donationAds.filter(ad => ad._id !== param),
                message: payload,
            }
        case UPDATE_DONATION_AD:
            let newState;

            const index = state.donationAds.findIndex(donationAd => donationAd._id === payload.data._id);

            if (index !== -1) {
                newState = state.donationAds.splice(index, 1, payload.data);
            }

            return {
                ...state,
                donationAds: newState,
                message: payload.message,
            }
        default:
            return state
    }
}
export default donationAdsReducer;