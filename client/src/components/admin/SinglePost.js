import React,{useEffect,useState} from "react"
import styleSingle from "../../styles/SinglePost.module.css"
import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import {getOnePost,updatePost} from "../../actions/postActions"


const SinglePost = (props) => {

    const [post,setPost] = useState({})

    useEffect(() => {
        document.body.style.background = "white";
        document.getElementsByClassName("App")[0].style.display = "flex";
        props.getOnePost(props.match.params.id)

        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[]);

    useEffect(() =>{
        setPost(props.post)  
    },[props.post])

    const updatePost = () => {
        const id = post._id
        props.updatePost(post,id)
    }
    const handleChange = (e) => {
        setPost({...post,[e.target.name]: e.target.value})
    }

    return(
        <div className={styleSingle.containerSingleUser}>
            <div className={styleSingle.containerBorder} onChange={handleChange} >
                {
                    post !== undefined &&
                    <div className={styleSingle.form}>
                        <div>
                            <label>Title</label>
                            <input name="title" defaultValue={post.title}/>
                        </div>
                        <div>
                            <label>Description</label>
                            <input name="content" defaultValue={post.content}/>
                        </div>
                    </div>
                }
                <button onClick={updatePost}>Update</button>
            </div>
            <div>
                {console.log(post)}
            </div>

        </div>
    )
}

const mapDispatch = (dispatch) => bindActionCreators({
    getOnePost,
    updatePost
},dispatch)

const mapStateToProp = (state) => ({
    post:state.posts.post.post

})

export default connect(mapStateToProp,mapDispatch)(SinglePost)