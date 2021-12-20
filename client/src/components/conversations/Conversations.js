import './Conversations.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Conversations = ({conversation, currentUser}) => {
  const [user, setUser] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(()=>{
    const friendId = conversation.members.find((member)=> member !== currentUser._id);

    const getUser = async() => {
      try{
        const res = await axios.get(`/users?userId=${friendId}`);
        setUser(res.data)
      } catch(err) {
        console.log(err);
      }
    }
    getUser();
  },[currentUser, conversation]);

  return (
    <div className='conversations'>
      <img className='convo-img' src={user?.profilePicture ? PF + user.profilePicture : PF + 'pp.png'} alt=''/>
      <p className='convo-name'>{user?.username}</p>
    </div>
  )
}

export default Conversations;
