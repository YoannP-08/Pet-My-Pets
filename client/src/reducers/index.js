import { combineReducers } from 'redux';
import comments from './commentReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import users from './userReducer';
import donationAds from './donationAdsReducer';
import keeperAds from './keeperAdReducer';
import posts from "./postReduces"

export default combineReducers({
    error: errorReducer,
    auth: authReducer,
    comments,
    users,
    donationAds,
    keeperAds,
    posts
});

