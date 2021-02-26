import {
    GET_KEEPER_ADS,
    GET_KEEPER_AD,
    ADD_KEEPER_AD,
    DELETE_KEEPER_AD,
    UPDATE_KEEPER_AD
} from '../actions/types';

const initialState = {
    keeperAds: [],
    keeperAd: {},
}

const keeperAdsReducer = (state = initialState, action) => {
    const { type, payload, param } = action;

    switch (type) {
        case GET_KEEPER_ADS:
            return {
                ...state,
                keeperAds: payload, //res.data
            }
        case GET_KEEPER_AD:
                return {
                    ...state,
                    keeperAd: payload, //res.data
                }
        case ADD_KEEPER_AD:
            return {
                ...state,
                keeperAds: [payload, ...state.keeperAds], //res.data
            }
        case DELETE_KEEPER_AD:
            return {
                ...state, 
                keeperAds: state.keeperAds.filter(ad => ad._id !== param),
                message: payload,
            }
        case UPDATE_KEEPER_AD:
            let newState;

            const index = state.keeperAds.findIndex(keeperAd => keeperAd._id === payload._id);

            if (index !== -1) {
                newState = state.keeperAds.splice(index, 1, payload.data);
            }

            return {
                ...state,
                keeperAds: newState,
                message: payload.message,
            }
        default:
            return state
    }
}
export default keeperAdsReducer;