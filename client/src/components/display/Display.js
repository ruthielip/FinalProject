import { useState, useEffect, useContext } from 'react';
import './Display.css';
import Elements from '../elements/Elements';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Display = (props) => {
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

  return (
    <div>
     { username &&
       posts.length === 0 ?
        <h4 className='no-posts'>-{friend.username} has no posts-</h4> :
        <div className='wrapper-timeline'>
        <div className='images-display'>
           {posts.map((item, i)=>{
             return (
                <Elements key={i} post={item}/>
             )
           })}
           </div>
        </div>
     }


    </div>
  )
}

export default Display;
