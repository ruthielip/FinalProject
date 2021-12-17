import './Post.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Post = (props) => {
  const { post } = props;
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [display, setDisplay] = useState('none')
  const [showImg, setShowImg] = useState('none')
  const [user, setUser] = useState({});
  const [name, setName] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('')
  const [viewComments, setViewComments] = useState('none');
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user: currentUser} = useContext(AuthContext);

  useEffect(()=>{
    const fetchUsers = async () => {
      try{
        const res = await axios.get('/users/all');
        setAccounts(res.data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchUsers();
  },[]);

  useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id))
  },[currentUser._id, post.likes])

  useEffect(()=>{
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data)
    }
    fetchUser()
  }, [post.userId]);

  const hideOptions = () => {
    if(display==='none'){
      setDisplay('block')
    } else {
      setDisplay('none')
    }
  }

  const likeHandler = () => {
    try {
      axios.put(`/posts/${post._id}/like`, {userId: currentUser._id})
    } catch(err) {
      console.log(err)
    }
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, {data: {userId: currentUser._id}});
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const newDesc = {
      userId: currentUser._id
    }
    newDesc.desc = description;
    try {
      await axios.put(`/posts/${post._id}`, newDesc);
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  }

  const handleComment = async (e) => {
    e.preventDefault();
    const newComment = {
      userId: currentUser
    }
    newComment.text = comment;
    try {
      await axios.put(`/posts/${post._id}/comment`, newComment);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  const show = () => {
    setShowImg('block')
  }

  const hide = () => {
    setShowImg('none')
  }

  const editingStatus = () => {
    if(isEditing === true){
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const clickWrapper = () => {
    editingStatus();
    hideOptions();
  }

  const handleCommentView = () => {
    if(viewComments === 'none'){
      setViewComments('block')
    } else {
      setViewComments('none')
    }
  }

  return (
    <>
    <div className='post'>
      <div className='wrapper-post'>

         <div className='top'>
            <div className='top-left'>
                 <Link to={`profile/${user.username}`}>
                 <img src={user.profilePicture ? PF + user.profilePicture : PF + 'pp.png'} alt='post-profile'/>
                 </Link>
                 <Link to={`profile/${user.username}`} style={{textDecoration: 'none', color: 'black'}}>
                 <span className='username'>{user.username}</span>
                 </Link>
                 <span className='date'>{format(post.createdAt)}</span>
            </div>

            {currentUser._id === post.userId ?
              <div className='top-right'>
                 <i className="fas fa-ellipsis-h" onClick={hideOptions}></i>
                 <div className='options-wrapper' style={{display: display}}>
                    <div className='post-options' style={{display: display}}>
                       <div className='option-wrapper'>
                         <p className='option-delete' onClick={handleDelete}>Delete</p>
                         <hr/>
                         <p onClick={clickWrapper}>Edit</p>
                         <hr/>
                         <p className='option-cancel' onClick={hideOptions}>Cancel</p>
                       </div>
                    </div>
                 </div>
              </div>
              : null}
         </div>

         <div className='center'>
            <img className='center-img' src={PF + post.img} alt='post-img' onClick={show}/>

            <div className='main-zoomed' style={{display: showImg}}>
              <div className='zoomed-wrapper'>
                 <img className='zoomed' src={PF + post.img} alt='post-img'/>
                 <i className="fas fa-times exit" onClick={hide}></i>
              </div>
            </div>
         </div>

         <div className='container'>
            <div className='bottom'>

               <div className='likes'>
               {isLiked ? <i className="fas fa-heart" onClick={likeHandler}></i> : <i className="far fa-heart" onClick={likeHandler}></i>}
                  <span className='counter'> <strong>{like}</strong> likes</span>
               </div>

               <div className='caption'>
               <Link to={`profile/${user.username}`} style={{textDecoration: 'none', color: 'black'}}>
                  <p><strong>{user.username}</strong></p>
               </Link>

               {
                 isEditing ?
                 <>
                 <form onSubmit={handleEdit}>
                    <textarea className='textarea-caption' defaultValue={post.desc} onChange={(e)=>setDescription(e.target.value)}/><br/>
                    <div className='edit-buttons'>
                      <button className='edit-button' type='submit'>Done</button>
                      <button className='edit-button' onClick={editingStatus}>Cancel</button>
                    </div>
                 </form>
                 </>
                 : <p className='post-desc'>{post?.desc}</p>
               }

               </div>
            </div>
         </div>

         <div className='view-comments'>
           <p className='click-view' onClick={handleCommentView}>{viewComments === 'none' ? 'View Comments' : 'Hide Comments'}</p>
         </div>

         <div className='comments-post' style={{display: viewComments}}>
           {post.comments.map((item, i)=>{
             return(
               <div  key={i} >
               <div className='comment-info'>
                  {
                    accounts.map((account, index)=>{
                      if(account._id === item.id){
                        return(
                          <Link to={`/profile/${account.username}`} style={{textDecoration: 'none', color: 'black'}} onClick={() => window.location.href(`/profile/${account.username}`)}>
                          <p key={index} className='comment-username'><strong>{account.username}</strong></p>
                          </Link>
                        )
                      }
                    })
                  }
                  <p className='posted-comment'>{item.text}</p>
               </div>
               </div>
             )
           })}
         </div>
         <hr/>
         <form onSubmit={handleComment} className='add-comment'>

            <textarea className='comment-textarea' placeholder='Add comment...' onChange={(e)=>setComment(e.target.value)}></textarea>
            <button type='submit' className='comment-button'>Post</button>
         </form>

      </div>
    </div>
    </>
  )
}

export default Post;