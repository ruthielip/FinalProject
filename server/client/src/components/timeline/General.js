import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config';
import Post from '../post/Post';
import './Timeline.css';

const General = () => {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(()=>{
    const fetchAllPosts = async () => {
      try{
        const res = await axiosInstance.get('/posts/all');
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
         return <Post key={i} post={item}/>
       })}
    </div>
    </>
  )
}
export default General;
