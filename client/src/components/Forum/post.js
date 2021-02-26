import React, {useState, useEffect} from 'react';
import stylePost from "../../styles/Posts.module.css"

const Post = (props) => {
    let post = props.post;
    let [bgColor, setBgColor] = useState("antiquewhite");
    let [textColor, setTextColor] = useState("black");
    let [commentColor, setCommentColor] = useState("black");


 useEffect(() => {
    if (props.backgroundColor === post._id) {
        setBgColor("#51956b");
        setTextColor( "whitesmoke");
        setCommentColor("darkgreen")
    } else {
        setBgColor("white");
       setTextColor("black");
       setCommentColor("#315e44");
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [props.backgroundColor])

    return (
        <div className={stylePost.selector} style={{backgroundColor: bgColor, }}>
            <p className={stylePost.selector_text} style={{color: textColor}}>{post.title}</p>
            <p className={stylePost.comment} style={{color: textColor}}>{post.comments.length}</p>
            <svg className={stylePost.svg} style={{color: commentColor}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />

            </svg>
        </div>
    )
};

export default Post;
