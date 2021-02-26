export const GET_ALL_USERS = "GET_ALL_USERS"
export const DELETE_USER = "DELETE_USER"
export const ADD_USER = "ADD_USER"
export const GET_ONE_USER = "GET_ONE_USER"
export const UPDATE_USER = "UPDATE_USER"

// GET USER CONNECTED FROM LOCAL STORAGE//
let userObj 
if(localStorage.getItem("user")){
    userObj = JSON.parse(localStorage.getItem("user"));
}

export const getAllUsers = () => {
    return async function (dispatch){
        const res = await fetch("https://back-petsmypets.herokuapp.com/api/users",{
            method:"GET",
            headers:{
                'x-auth-token':userObj.token
            }
        })
        const users = await res.json()
        return dispatch({
            type:"GET_ALL_USERS",
            payload:users
        })
    }
}


export const removeUser = (id) => {
    return async function(dispatch){
        const res = await fetch(`https://back-petsmypets.herokuapp.com/api/users/${id}`,{
            method:"DELETE",
            headers:{
                'x-auth-token':userObj.token
            }
        })
        const deleteUser = await res.json()
        return dispatch ({
            type:"DELETE_USER",
            payload:deleteUser,
            param:id
        })

    }
}

export const addUser = (data) => {
    return async function(dispatch){
        const res = await fetch("https://back-petsmypets.herokuapp.com/api/users/signup",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const newUser = await res.json()

        const {user} = newUser

        return dispatch({
            type:"ADD_USER",
            payload:user,
        })
    }
}

export const getOneUser = (id) => {
    return async function(dispatch){
        const res = await fetch(`https://back-petsmypets.herokuapp.com/api/users/${id}`,{
            method:"GET",
            headers:{
                'x-auth-token':userObj.token  
            }    
        })
        let user = await res.json()

        return dispatch({
            type:"GET_ONE_USER",
            payload:user.user
        })
    }
}

export const updateUser = (user) =>{
    const {_id} = user
    return async function (dispatch){
        const res = await fetch(`https://back-petsmypets.herokuapp.com/api/users/${_id}`,{
            method:"PATCH",
            headers:{
                'x-auth-token':userObj.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'  
            },
            body:JSON.stringify(user)   
        })
        let updatedUser = await res.json()

        return dispatch({
            type:"UPDATE_USER",
            payload:updatedUser
        })
    }
}