import React, { useState} from "react";
import axios from "axios";
import styleComment from "../../styles/Comments.module.css"
import stylePost from "../../styles/Posts.module.css";
import Swal from "sweetalert2";


const Comment = (props) => {

    let [editComment, setEditComment] = useState(null);
    let [edit, setEdit] = useState(false);
    let userId = props.userId;
    let comment = props.comment;
    let headers = props.headers;
    let post = props.post;
    const getPost = props.getPost;

    /**
     * Edit the comment through a modal
     * @param id
     * @return {Promise<void>}
     */
    const handleEditComment = async (id) => {
        axios.put("/comments/" + id, {
                comment: editComment,
                user_id: userId,
                post_id: post._id
            },
            headers
        ).then(() => {
            Swal.fire({
                title: "Success",
                text: "Comment has been edited",
                icon: "success"
            })
            setEditComment(null)
            getPost();
            setEdit(false);

        }).catch((e) => {
            Swal.fire({
                title: "An error occured",
                text: e,
                icon: "error"
            })
        })
    }

    /**
     * Delete a comment through a modal
     * @param id
     * @return {Promise<void>}
     */
    const handleDeleteComment = async (id) => {
        Swal.fire({
            title: "Are you sure to delete this comment ? ",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            reverseButtons: true
        }).then((result) => {
            if(result.isConfirmed) {
                axios.delete("/comments/" + id,
                    headers
                ).then(() => {
                    Swal.fire({
                        title: "Success",
                        text: "Comment deleted",
                        icon: "success"
                    })
                    getPost();
                }).catch((e) => {
                    Swal.fire({
                        title: "An error occured",
                        text: e,
                        icon: "error"
                    })
                })
            }
        })
    }


    return (
        <div>
            {comment.user_id ? (
                <div className={styleComment.comment}>
                    <div className={styleComment.header} >
                        <div className={styleComment.author}>
                            <p className={styleComment.mr2}>From : {comment.user_id.username}</p>
                            <p>{comment.createdAt.substring(0,10)}</p>
                        </div>
                        { comment.user_id._id === userId || props.isAdmin ? (
                        <div className={styleComment.icons}>
                            <svg className={stylePost.pencil}  onClick={() => {
                                setEdit(!edit)
                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <svg className={stylePost.bin} onClick={() =>handleDeleteComment(comment._id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        ): (<div/>)}
                    </div>
                    <p className={styleComment.content }>{comment.comment}</p>

                    <div>
                        {edit &&
                        <div className={styleComment.form}>
                            <p className={styleComment.formText}>Edit the Comment :</p>
                            <div className={styleComment.inputBox}>
                                <textarea className={stylePost.editArea} defaultValue={comment.comment} onChange={(e) =>setEditComment(e.target.value)}/>


                                <button className={styleComment.inputBtn} onClick={() => handleEditComment(comment._id)}>Edit the comment</button>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            ): (
                <div className={styleComment.comment}>
                    <div className={styleComment.header} >
                        <div className={styleComment.author}>
                            <p className={styleComment.mr2}>From : User Unknown</p>
                            <p>{comment.createdAt.substring(0,10)}</p>
                        </div>
                        {props.isAdmin &&
                        <div className={styleComment.icons}>
                            <svg className={stylePost.pencil}  onClick={() => {
                                setEdit(!edit)
                            }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <svg className={stylePost.bin} onClick={() =>handleDeleteComment(comment._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        }
                    </div>
                    <p className={styleComment.content }>{comment.comment}</p>

                    <div>
                        {edit &&
                        <div className={styleComment.form}>
                            <p className={styleComment.formText}>New Content :</p>
                            <div className={styleComment.inputBox}>
                                <textarea defaultValue={comment.comment} onChange={(e) =>setEditComment(e.target.value)}/>


                                <button className={styleComment.inputBtn} onClick={() => handleEditComment(comment._id)}>Edit the comment</button>
                            </div>
                        </div>
                        }
                    </div>
                </div>

            )}
        </div>
    )

};
export default Comment;
