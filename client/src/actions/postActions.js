export const GET_ALL_POSTS = "GET_ALL_POSTS"
export const ADD_POST = "ADD_POST"
export const DELETE_POST = "DELETE_POST"
export const UPDATE_POST = "UPDATE_POST"
export const GET_ONE_POST = "GET_ONE_POST"


// GET USER CONNECTED FROM LOCAL STORAGE//
let userObj 
if(localStorage.getItem("user")){
    userObj = JSON.parse(localStorage.getItem("user"));
}


export const getAllPosts = () => {
    return async function(dispatch){

        const res = await fetch("https://back-petsmypets.herokuapp.com/api/posts",{
            method:"GET",
            headers:{
                'x-auth-token':userObj.token
            }
        })

        const posts = await res.json()

        return dispatch({
            type:"GET_ALL_POSTS",
            payload:posts
        })
    }

}

export const addPost = (newPost) => {
    return async function(dispatch){

        const res = await fetch("https://back-petsmypets.herokuapp.com/api/posts",{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'x-auth-token':userObj.token

            },
            body:JSON.stringify(newPost)
        })

        const post = await res.json()

        return dispatch({
            type:"ADD_POST",
            payload:post
        })
    }
}

export const removePost = (id) => {
    return async function(dispatch){

        const res = await fetch(`https://back-petsmypets.herokuapp.com/api/posts/${id}`,{
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json',
                'x-auth-token':userObj.token
            }
        })

        const deletePost = await res.json()

        return dispatch({
            type:"DELETE_POST",
            payload:deletePost,
            param:id
        })

    }
}

export const updatePost = (updatePost,id) => {
    return async function (dispatch){

        const res= await fetch(`https://back-petsmypets.herokuapp.com/api/posts/${id}`,{
            method:"PATCH",
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':userObj.token
            },
            body:JSON.stringify(updatePost)
        })

        const post = await res.json()

        return dispatch({
            type:"UPDATE_POST",
            payload:post
        })
    }
}

export const getOnePost = (id) => {
    return async function (dispatch){

        const res = await fetch(`https://back-petsmypets.herokuapp.com/api/posts/${id}`,{
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                'x-auth-token':userObj.token
            }
        })

        const post = await res.json()

        console.log(post,"ACTION")

        return dispatch({
            type:"GET_ONE_POST",
            payload:post
        })
    }
}

