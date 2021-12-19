import { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../post/Post';
import './Timeline.css';

const General = ({socket, socketUser}) => {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(()=>{
    const fetchAllPosts = async () => {
      try{
        const res = await axios.get('/posts/all');
        setAllPosts(res.data.sort((one, two)=>{
          return new Date(two.createdAt) - new Date(one.createdAt);
        }))
      } catch(err) {
        console.log(err);
      }
    }
    fetchAllPosts();
  },[]);

  return(
    <>
    <div className='wrapper-timeline'>
       {allPosts.map((item, i)=>{
         return <Post socket={socket} socketUser={socketUser} key={i} post={item}/>
       })}
    </div>
    </>
  )
}
export default General;
