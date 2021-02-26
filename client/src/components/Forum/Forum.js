import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Post from "./post";
import SinglePost from "./singlePost";
import styleForum from "../../styles/Forum.module.css";
import Swal from "sweetalert2";

const Forum = () => {

    const [posts, setPosts] = useState(null);
    const [select, setSelect] = useState(null);
    const [form, setForm] = useState(false);
    const [title, setTitle] = useState(null);
    const [content, setContent] = useState(null);
    const [search, setSearch] = useState(null);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    let headers = {
        headers: {
            'x-auth-token': token
        }
    };
    /**
     *
     * @return {Promise<void>}
     * @description Initial call to the Api to get the posts. Place in the state the posts, and select the first one to render into singlePost
     */

    let callApi = async (id = null) => {
        axios.get("/posts", {
            headers
        }).then(
            r => {
                let posts = r.data.reverse()
                setPosts(posts)
                if (posts.length === 0) {
                    setSelect('nope');
                }
                if (!id) {
                setSelect(posts[0]._id)
                } else {
                    setSelect(id)
                }
            }
        )
    }

    /**
     * @description Toggle the color of the post selected, render it in singlePost and shut down the new Post form if it was active
     * @param id
     * @return void
     */
    let togglePost = (id) => {
        setForm(false);
        setSelect(id);
    }

    /**
     * @description Toggle the new content form, and deselect the previously selected post
     * @return void
     */
    let toggleForm = () => {
        setSelect("nope");
        setForm(true);
    }

    /**
     * @description Looks for the title and content state, and call the api to create a Post if they are not empty.
     * @return {Promise<void>}
     */

    let createPost = async () => {
        if (title && content) {
            axios.post("/posts", {
                    title: title,
                    content: content,
                    user_id: userId
                },
                headers
            ).then(() =>{
                setForm(false);
                callApi();
            })
        } else {
            Swal.fire({
                title: "Warning",
                text: "Please fill all the fields",
                icon: "warning"
            })
        }
    }

    /**
     *
     * @param id
     * @return {Promise<void>}
     */

    let deletePost = async (id) => {
        axios.delete("/posts/" + id,
            headers
        ).then(() => {
            Swal.fire({
                title: "Success",
                text: "Post has been deleted",
                icon: "success"
            })
            callApi()
        }).catch(e =>
            Swal.fire({
                title: "An error occured",
                text: e,
                icon: "error"
            })
        )
    }

    /**
     * @description Look into the posts title and content for the input in param, or disable the search if the field is empty
     * @param search
     */

    let handleSearch = (search) => {
        if (!search) {
            setSearch(null)
            setForm(null);
            setSelect(posts[0]._id)
        } else {
            setSearch(search)
            setSelect('noResult')
        }
    }

    /**
     * @description Look into the local storage for a user key and set the infos needed in the state (token, user ID and an admin boolean)
     * @return void
     */
    const getUser = () => {
        if (localStorage.getItem("user")) {
            let user = JSON.parse(localStorage.getItem("user"));
            setToken(user.token);
            setUserId(user.user.id)
            setIsAdmin(user.user.isAdmin)
        }
    }

    useEffect(() => {
        document.body.style.background = "#2f3542"
        callApi();
        getUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ margin: "2rem"}}>
            <p className={styleForum.title}>Discuss</p>
            <div className={styleForum.searchContainer}>
                <input placeholder={"Search"} className={styleForum.searchBar} onChange={(e) => handleSearch(e.target.value)}/>
            </div>
            <div >
                {userId ? (
                <div className={styleForum.flexBtn}>
                    <button className={styleForum.btn} onClick={() => toggleForm()}>Add a new post</button>
                </div>
                ): <div className={styleForum.btn} style={{visibility: "hidden"}}/>}
                <div className={styleForum.generalContainer}>
                    <div className={styleForum.selectorContainer}>
                        {search ? (
                            <div >
                                {posts && select ? (
                                    posts.map(post => (
                                        <div key={post._id}>
                                            {post.content.toLowerCase().includes(search.toLowerCase()) || post.title.toLowerCase().includes(search.toLowerCase()) ? (
                                                <div onClick={() => togglePost(post._id)} >
                                                    <Post post={post} backgroundColor={select} key={post._id} token={token}/>
                                                </div>
                                            ): (
                                                <div/>
                                            )}
                                        </div>
                                    ))) : (
                                    <p>No posts for now !</p>
                                )}
                            </div>
                        ): (
                            <div>
                                {posts && select ? (
                                    posts.map(post => (
                                        <div onClick={() => togglePost(post._id)} key={post._id}>
                                            <Post post={post} backgroundColor={select} key={post._id}/>
                                        </div>
                                    ))) : (
                                    <p>No posts for now !</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={styleForum.posts_container}>
                        {select && !form ? (
                            <div >
                                {select !== 'noResult' ? (
                                    <SinglePost post={select} deletePost={deletePost} callApi={callApi} headers={headers} userId={userId} isAdmin={isAdmin} key={select} />
                                ) : (
                                    <div/>
                                )}
                            </div>
                        ) : (
                            <div className={styleForum.formEdit}>
                                <div className={styleForum.inputBox}>
                                    <p className={styleForum.formText}>Title</p>
                                    <input className={styleForum.textInput}  onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}/>
                                </div>
                                <br/>
                                <div className={styleForum.inputBox}>
                                    <p className={styleForum.formText}>Content</p>
                                    <textarea className={styleForum.textArea} onChange={(e) => {
                                        setContent(e.target.value)
                                    }}/>
                                </div>

                                <div className={styleForum.btnContainer}>
                                    <button className={styleForum.inputBtnEdit} onClick={() => createPost()}>Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Forum;
