import { GET_ALL_USERS, DELETE_USER, ADD_USER, GET_ONE_USER, UPDATE_USER } from "../actions/userAction"

const initialState = {
    users: [],
    user: {},
    message: {}
}

const userReducer = (state = initialState, action) => {
    const { type, payload, param } = action


    switch (type) {
        case GET_ALL_USERS: {
            return {
                ...state,
                users: payload
            }
        }

        case DELETE_USER: {
            return {
                ...state,
                users: state.users.filter(user => user._id !== param),
                message: payload,
            }
        }

        case ADD_USER: {
            return {
                ...state,
                users:[ payload, ...state.users],
            }
        }

        case GET_ONE_USER: {
            return {
                ...state,
                user: payload
            }
        }
        case UPDATE_USER: {
            let newState = []

            state.users.findIndex(user => {
                if (user._id !== payload.user._id) {
                    newState.push(user)
                }
                return null
            })
            return {
                ...state,
                message: payload.message,
                users: [...newState, payload.user],
            }
        }


        default:
            return state
    }
}

export default userReducer