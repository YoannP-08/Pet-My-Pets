import { GET_ALL_POSTS, ADD_POST,DELETE_POST,UPDATE_POST,GET_ONE_POST} from "../actions/postActions"

const initialState = {
    posts:[],
    post:{},
    message:{}
}

const postReducer = (state = initialState, action ) => {
    const { type,payload,param } = action

    switch (type) {
        case GET_ALL_POSTS: {
            return {
                ...state,
                posts:payload
            }

        }

        case ADD_POST:{
            return{
                ...state,
                posts:[...state.posts,payload.post],
                message:payload.message
            }
        }

        case DELETE_POST:{
            return{
                ...state,
                posts:state.posts.filter(post => post._id !== param),
                message:payload.message
            }
        }
        case UPDATE_POST:{
            return{
                ...state,
                message:payload.message
            }
        }

        case GET_ONE_POST:{
            return {
                ...state,
                post:payload
            }
        }



        default:
            return state
    }


}

export default postReducer