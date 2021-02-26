import React, {useEffect, useState} from "react";
import axios from "axios";
import Comment from "./comment";
import stylePost from "../../styles/Posts.module.css";
import Swal from 'sweetalert2';

const SinglePost = (props) => {
    let [post, setPost] = useState(null);
    let [comments, setComments] = useState(null);
    let [form, setForm] = useState(null);
    let [commentContent, setCommentContent] = useState(null);
    let [editPost, setEditPost] = useState(false);
    let [title, setTitle] = useState(false);
    let [content, setContent] = useState(false);
    let [report, setReport] = useState(false);
    let [reportContent, setReportContent] = useState(false);
    let [userName, setUserName] = useState("User Unknown");

    let headers = props.headers;
    let userId = props.userId;
    let isAdmin = props.isAdmin;

    /**
     * Call Api to get the single post
     * @return {Promise<void>}
     */
    let getPost = async () => {
        axios.get("/posts/" + props.post, {
        }).then(
            r => {
                if (r.data.post.user.length !== 0) {
                    setUserName(r.data.post.user[0].username)
                }
                setPost(r.data.post)
                setComments(r.data.comments)
            }
        )
    }

    /**
     * @description Show a warning alert, and call the api to delete the post
     * @return void
     */

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure to delete this post ? ",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            reverseButtons: true
        }).then((result) => {
            if(result.isConfirmed) {
                props.deletePost(post._id)
                Swal.fire({
                    title: "Success",
                    text: "You post has been deleted",
                    icon: "success"
                })
            }
        })
    }

    /**
     * @description Edit the post through a call to the api
     * @return {Promise<void>}
     */
    const handleEdit = async () => {
        axios.patch("/posts/" + post._id, {
                title: title,
                content: content,
            },
            headers
        ).then(() => {
            Swal.fire({
                title: "Success",
                text: "The post has been edited",
                icon: "success"
            })
            setEditPost(false);
            setContent(null);
            setTitle(null);
            props.callApi(props.post);
        }).catch((e) => {
            Swal.fire({
                title: "An error occured",
                text: e,
                icon: "error"
            })
        })
    }

    /**
     * @description Create a new comment through a call to the api
     * @return {Promise<void>}
     */
    const handleSubmitComment = async() => {
        axios.post("/comments", {
                comment: commentContent,
                user_id: userId,
                post_id: post._id
            },
            headers
        ).then(() => {
            setForm(false);
            setCommentContent(null);
            props.callApi(props.post);
            getPost();
        }).catch((e) => {
            Swal.fire({
                title: "An error occured",
                text: e,
                icon: "error"
            })
        })
    }

    /**
     * @description Submit a report for the current post, which goes to the admin panel
     * @return {Promise<void>}
     */
    const handleReport = async () => {
        axios.post('/reports', {
                user_id: userId,
                post_id: post._id,
                content: reportContent
            },
            headers
        ).then(() => {
                Swal.fire({
                    title: "Success",
                    text: "Your report has been submitted",
                    icon: "success"
                })
                setReport(false);
            }
        ).catch((e) => {
            Swal.fire({
                title: "An error occured",
                text: e,
                icon: "error"
            })
        })

    }

    useEffect(() => {
        getPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.post])

    return (
        <div>
            {post ? (
                <div>
                    <div className={stylePost.singlePost}>
                        <div>
                            <div className={stylePost.header}>
                                <div className={stylePost.ghost}/>
                                <p className={stylePost.singlePostTitle}>{post.title}</p>
                                <div className={stylePost.icons}>
                                    <svg className={stylePost.exclamation} onClick={() => {
                                        setReport(!report)
                                        setEditPost(false);
                                        setForm(false);
                                    }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {userId === post.user_id || props.isAdmin ? (
                                        <div>
                                            <svg className={stylePost.pencil}  onClick={() => {
                                                setReport(false);
                                                setForm(false);
                                                setEditPost(!editPost);
                                                setTitle(post.title);
                                                setContent(post.content);
                                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>

                                            <svg className={stylePost.bin} onClick={() => handleDelete()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                    ) :(
                                        <div/>)}
                                </div>
                            </div>
                            <div className={stylePost.author}>
                                <p className={stylePost.mr2}>Author : {userName}</p>
                                <p>{post.createdAt.substring(0,10)}</p>
                            </div>
                            <p className={stylePost.content}>{post.content}</p>
                            {userId &&
                            <button className={stylePost.commentBtn} onClick={() => {
                                setEditPost(false);
                                setReport(false);
                                setForm(!form)
                            }}>
                                <svg className={stylePost.svg} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Comment this post</button>}
                            {form &&
                            <div className={stylePost.form}>
                                <p className={stylePost.formText}>Enter your comment :</p>
                                <div className={stylePost.inputBox}>
                                    <textarea className={stylePost.editArea} onChange={(e) => setCommentContent(e.target.value)}/>
                                    <button className={stylePost.inputBtn} onClick={() => handleSubmitComment()}>
                                        Submit</button>
                                </div>
                            </div>
                            }
                            {report &&
                            <div className={stylePost.form}>
                                <p className={stylePost.formText}>Why are you reporting this post ? </p>
                                <div className={stylePost.inputBox}>
                                    <textarea className={stylePost.editArea} onChange={(e) => setReportContent(e.target.value)}/>
                                    <button className={stylePost.inputBtn} onClick={() => handleReport()}>Submit</button>
                                </div>
                            </div>
                            }
                            {userId === post.user_id || props.isAdmin ? (
                                <div>
                                    {editPost &&
                                    <div className={stylePost.formEdit}>
                                        <div className={stylePost.editFlex}>
                                            <p className={stylePost.formText}>Title</p>
                                            <input className={stylePost.editArea} defaultValue={post.title} onChange={(e) => {
                                                setTitle(e.target.value)
                                            }}/>
                                        </div>
                                        <br/>
                                        <div className={stylePost.editFlex}>
                                            <p className={stylePost.formText}>Content</p>
                                            <textarea className={stylePost.editArea} defaultValue={post.content} onChange={(e) => {
                                                setContent(e.target.value)
                                            }}/>
                                        </div>
                                        <br/>
                                        <div className={stylePost.btnContainer}>
                                            <button className={stylePost.inputBtnEdit} onClick={() => handleEdit()}>Submit</button>
                                        </div>
                                    </div>
                                    }
                                </div>
                            ): (
                                <div/>
                            )}
                        </div>
                    </div>
                    <div>
                        {comments ? (
                            comments.map(comment => (
                                <div key={comment._id}>
                                    <Comment userId={userId} comment={comment} headers={headers} post={post} getPost={getPost} isAdmin={isAdmin}/>
                                </div>
                            ))
                        ): (
                            <div/>
                        )}
                    </div>
                </div>
            ): (
                <div/>
            )}
        </div>


    )
}

export default SinglePost;
