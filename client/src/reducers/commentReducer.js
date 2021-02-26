import {
    GET_COMMENTS,
    //GET_A_COMMENT, 
    //ADD_COMMENT, 
    //EDIT_COMMENT, 
    //DELETE_COMMENT,
    COMMENTS_LOADING,
} from '../actions/types';

const initialState = {
    comments: [],
    loading: false
}

const commentReducer = (state = initialState, action) => {

    const { type, payload } = action
    switch (type) {
        case GET_COMMENTS:
            return {
                ...state,
                comments: payload,
                loading: false
            }
        case COMMENTS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state
    }
}

export default commentReducer