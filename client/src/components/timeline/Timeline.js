import { useState, useEffect, useContext } from 'react';
import './Timeline.css'
import Share from '../share/Share';
import Post from '../post/Post';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Timeline = (props) => {
  const {username} = props;
  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);
  const [friend, setFriend] = useState({});

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
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setFriend(res.data)
    }
    fetchUser()
  }, [username]);

  console.log(username);

  return (
    <div className='timeline'>
     {
       posts.length === 0 ?
        <h4 className='no-posts-timeline'>-No posts-</h4> :
        <div className='wrapper-timeline'>
        {/* !username && <Share/> */}
           {posts.map((item, i)=>{
             return <Post key={i} post={item}/>
           })}
        </div>
     }


    </div>
  )
}

export default Timeline;
