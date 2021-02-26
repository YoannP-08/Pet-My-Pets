import React,{useState} from "react"
import {connect } from "react-redux"
import {bindActionCreators} from "redux"
import {addPost} from "../../actions/postActions"
import Cross from "../../assets/close.svg"
import styleUser from "../../styles/Users.module.css"


const AdPostModal = ({close,addPost}) => {

    const [title, setTitle] = useState()
    const [description, setDescription] = useState()


   const submitPost = (e) => {
       let userObj = JSON.parse(localStorage.getItem("user"));
        e.preventDefault()

        let newPost = {
            title:title,
            content:description,
            user_id:userObj.user.id
        }

        addPost(newPost)

        setTitle("")
        setDescription("")

        close()
   }

    return(
        <div className={styleUser.addModalContainer}>
            <div className={styleUser.headerAddModal}>
                <h1>Add Post</h1>
                <img  onClick={() => close()} src={Cross} alt="close"/>
            </div>
            <form onSubmit={submitPost}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={title} onChange={(e) =>setTitle(e.target.value)}/>
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={description}  onChange={(e) =>setDescription(e.target.value)}/>
                </div>
                <button>Add Post</button>
            </form>
        </div>
    )
}

const mapDispatch = (dispatch) => bindActionCreators({
    addPost
},dispatch)

export default connect(null,mapDispatch)(AdPostModal)