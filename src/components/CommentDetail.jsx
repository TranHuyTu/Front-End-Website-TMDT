import { Avatar, Grid, Paper, Rating, Typography } from "@mui/material";
import axiosClient from "@api/axiosClient";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Loader from "./Loader";

const CommentDetail = ({commentParent, productId}) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [users, setUsers] = useState([]);
    const [parentCommentId, setParentCommentId] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [parentFinish, setParentFinish] = useState();

    useEffect(()=>{
        // setParentCommentId(parentCommentId);
        fetchData();
    }, [])
    const fetchData = async () => {
        if(commentParent){
            const result = await axiosClient
            .get(`/comment?productId=${productId}&parentCommentId=${commentParent}`,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
            const comment = result.filter((value)=>value.comment_parentId === commentParent);
            comment.map(async (value, index) => {
                // console.log(value);
                const result = await axiosClient
                .post(`/user/query?userId=${value.comment_userId}`,{},
                {
                    headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
                });
                setUsers([...users, result])
            })
            setComments(comment);
            setParentCommentId(commentParent);
        }else{
            const result = await axiosClient
            .get(`/comment?productId=${productId}`,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
            setComments(result);
        }
        const comment = await axiosClient
            .get(`/comment?productId=${productId}`,
            {
                headers: { 
                        'content-type': 'application/x-www-form-urlencoded',
                        'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                        'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                    },
            });
        setParentFinish(comment[0]._id);
    }

    const handleChange = (event) => {
        setComment(event.target.value);
    };

    const handleRelayComment = (commentParentId) =>{
        const element = document.getElementById(commentParentId);
        if(parentCommentId === null) {
            element.style.display = 'block';
            setParentCommentId(commentParentId);
        }else{
            element.style.display = 'none';
            setParentCommentId(null);
        }
    }

    const handleShowRelayComment = (commentParentId) => {
        if(parentCommentId === null) {
            const element = document.querySelector(".comments-chill"+commentParentId);
            const root = createRoot(element);
            setParentCommentId(commentParentId);
            root.render(<CommentDetail commentParent={commentParentId} productId={productId} />);

            return () => {
                root.unmount();
            };  
        }else{
            const element = document.querySelector(".comments-chill"+commentParentId);
            const root = createRoot(element);
            setParentCommentId(null);
            root.render(<></>);

            return () => {
                root.unmount();
            };  
        }
    }

    const handleSubmitCommentRelay = async (event) =>{
        event.preventDefault();

        const roleUser = await axiosClient
            .post(`/user/role`,{},
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });

        const commentNew = {
            productId: productId,
            userId: roleUser.userId,
            content: comment,
            parentCommentId: parentCommentId
        }
        await axiosClient
            .post(`/comment`, commentNew,
            {
                headers: { 
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-client-id': JSON.parse(sessionStorage.getItem('x-client-id')),
                    'x-rtoken-id': JSON.parse(sessionStorage.getItem('x-rtoken-id')),
                },
            });
        setReloadKey(prevKey => prevKey + 1);
        handleRelayComment(parentCommentId);
        handleShowRelayComment(parentCommentId);
    }
    const imgLink = "https://cdn.pixabay.com/photo/2014/04/02/17/07/user-307993_1280.png"    
    if(comments.length === 0 || users.length === 0) {
        <></>
    }else{
        return (
            <div style={{ padding: 14 }} className="comments">
                {comments.length !==0 && comments.map((value, index) => 
                {
                    const user = users.filter((use)=> use.user_id === value.comment_userId);

                    return (<Paper style={{ padding: "5px 3px" }}>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                            <Avatar alt="Remy Sharp" src={user.avatar || imgLink} />
                            {
                                commentParent === parentFinish && (
                                <Grid item xs>
                                <Typography component="legend">Item quality</Typography>
                                <Rating name="read-only" value={4.5} readOnly />
                                <Typography component="legend">Shipping</Typography>
                                <Rating name="read-only" value={3} readOnly />
                                <Typography component="legend">Customer service</Typography>
                                <Rating name="read-only" value={5} readOnly />
                                </Grid>)
                            }         
                        </Grid>
                        <Grid justifyContent="left" item xs zeroMinWidth>
                            <h5>{user[0].first_name}  {user[0].last_name}</h5>
                            <p style={{ textAlign: "left" }}>
                            {value.comment_content}
                            </p>
                            <p style={{ textAlign: "left", color: "gray" }}>
                            posted 1 minute ago
                            </p>
                            <button 
                            className='text-blue-600 font-semibold hover:underline'  
                            onClick={() => handleRelayComment(value._id)}
                            >Relay</button>
                            <button 
                            className='text-blue-600 ml-5 font-semibold hover:underline'  
                            onClick={() => handleShowRelayComment(value._id)}
                            >Show Relay</button>
                            <div className='comment-relay' id={value._id} style={{display: 'none'}}>
                                <form className="mb-6">
                                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border-solid border-2 border-indigo-600">
                                        <label htmlFor="comment" className="sr-only">Your comment</label>
                                        <textarea id="comment" rows="6"
                                            className="px-0 w-full text-sm text-gray-900 border-1 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                            placeholder="Write a comment..." required
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                    <button type="submit"
                                        onClick={handleSubmitCommentRelay}
                                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
                                        style={{background: '#1972f5'}}>
                                        Post comment
                                    </button>
                                </form>
                            </div>
                            <div style={{ padding: 14 }} className={"comments-chill"+value._id}>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>)
                }
                )}
            </div>
        )
    }
    
}

export default CommentDetail;