import { useState, useEffect, useContext } from 'react';
import './Timeline.css'
import Share from '../share/Share';
import Post from '../post/Post';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import General from './General';

const Timeline = (props) => {
  const {username} = props;
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([])
  const {user} = useContext(AuthContext);
  const [friend, setFriend] = useState({});
  const [followingDisplay, setFollowingDisplay] = useState('none');
  const [generalDisplay, setGeneralDisplay] = useState('block');

  useEffect(()=>{
    const fetchPosts = async () => {
      const res = username
         ? await axios.get(`/posts/profile/${username}`)
         : await axios.get(`/posts/timeline/${user._id}`);
      setPosts(res.data.sort((one, two)=>{
        return new Date(two.createdAt) - new Date(one.createdAt);
      }))
    }
    fetchPosts()
  }, [username, user._id]);

  useEffect(()=>{
    const fetchAllPosts = async () => {
      try{
        const res = await axios.get('/posts/all');
        setAllPosts(res.data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchAllPosts();
  },[]);

  useEffect(()=>{
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setFriend(res.data)
    }
    fetchUser()
  }, [username]);

  const showGeneral = () => {
    setFollowingDisplay('none')
    setGeneralDisplay('block')
  }

  const showFollowing = () => {
    setGeneralDisplay('none')
    setFollowingDisplay('block')
  }

  return (
    <div className='timeline'>
    <div className='timeline-options'>
      {generalDisplay === 'block' ?
         <p className='tl-option' onClick={showGeneral} style={{borderBottom: '1px solid black'}}>General</p> :
         <p className='tl-option' onClick={showGeneral}>General</p>
       }

      <p> | </p>
      {followingDisplay === 'block' ?
        <p className='tl-option' onClick={showFollowing} style={{borderBottom: '1px solid black'}}>Following</p> :
        <p className='tl-option' onClick={showFollowing}>Following</p>
      }
    </div>

     <div style={{display: generalDisplay}}>
     <General />
     </div>

     {
       posts.length === 0 ?
        <h4 className='no-posts-timeline'>-No posts-</h4> :
        <div className='wrapper-timeline' style={{display: followingDisplay}}>
           {posts.map((item, i)=>{
             return <Post key={i} post={item}/>
           })}
        </div>
     }


    </div>
  )
}

export default Timeline;