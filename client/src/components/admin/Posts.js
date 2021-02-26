import React,{useEffect,useState} from "react"
import stylePosts from "../../styles/Posts.module.css"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getAllPosts,removePost } from "../../actions/postActions"
import AdPostModal from "./AdPostModal"
import { Link } from "react-router-dom"
import styleUsers from "../../styles/Users.module.css"




const Posts = ({getAllPosts,posts,removePost,message}) => {

    useEffect(() =>{

        document.body.style.background = "white"
        document.getElementsByClassName("App")[0].style.display = "flex"
        getAllPosts()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const [isOpen, setIsOpen ] = useState(false)

    const tooglePostModal = () => {
        setIsOpen(!isOpen)
    }

    const deletePost = (id) => {

        removePost(id)
    }


    return(
        <div className={stylePosts.containerSingleUser}>
            <div className={stylePosts.containerBorder}>
                <div className={stylePosts.containerLogo}>
                    <h1>Posts</h1>
                    {Object.keys(message).length !== 0 && <h5>{message}</h5> }
                </div>
                <div className={stylePosts.btnDashboard}>
                    <button onClick={tooglePostModal}>Add post</button>
                </div>
                <div>
                    {
                        isOpen 
                        &&
                        <div>
                            <div className={stylePosts.containerAddPosts}>
                                <AdPostModal close={setIsOpen} />
                            </div>
                             <div className={stylePosts.overlay}></div>
                        </div>
                    }
                </div>
                <div className={styleUsers.fullHeight}>
                    <table className={styleUsers.adminTable}>
                        <thead className={styleUsers.tableHead}>
                                <tr>
                                        <th className={styleUsers.titleTab}><p>Title</p></th>
                                        <th className={styleUsers.titleTab}><p>Delete Post</p></th>
                                </tr>
                        </thead>
                        <tbody className={styleUsers.tableBody}>
                            {
                        posts.map((post,index) =>(
                            <tr key={index}>
                                <td>
                                    <Link to={`/admin/dashboard/posts/${post._id}`}><h1>{post.title}</h1></Link>
                                </td>
                                <td> <button onClick={() => deletePost(post._id)}>delete</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const mapDispatch = (dispatch) => bindActionCreators({
    getAllPosts,
    removePost
},dispatch)

const mapStateToProp = state => ({
    posts:state.posts.posts,
    message:state.posts.message
})



export default connect(mapStateToProp,mapDispatch)(Posts)