import axios from 'axios';
import { 
    GET_COMMENTS, 
    GET_A_COMMENT, 
    ADD_COMMENT, 
    EDIT_COMMENT, 
    DELETE_COMMENT,
    COMMENTS_LOADING
    } from './types';

export const getComments = () => {
    return async function (dispatch) {
        dispatch(setCommentsLoading());
        const res = await axios.get('/comments');  
        return dispatch({
            type: GET_COMMENTS,
            payload: res.data.data
        });
    };
};

export const setCommentsLoading = () => {
    return {
        type: COMMENTS_LOADING,
    }
}
