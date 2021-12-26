import './Conversations.css';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../config';

const Conversations = ({conversation, currentUser, deleteConversation}) => {
  const [user, setUser] = useState([]);
  const [display, setDisplay] = useState('none')
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(()=>{
    const friendId = conversation.members.find((member)=> member !== currentUser._id);

    const getUser = async() => {
      try{
        const res = await axiosInstance.get(`/users?userId=${friendId}`);
        setUser(res.data)
      } catch(err) {
        console.log(err);
      }
    }
    getUser();
  },[currentUser, conversation]);

  return (
    <div className='conversations'>
      <div className='conversations-left'>
        <img className='convo-img' src={user?.profilePicture ? PF + user.profilePicture : PF + 'pp.png'} alt=''/>
        <p className='convo-name'>{user?.username}</p>
      </div>
      <div className='conversations-right'>
        <button className='convo-dlt-btn' onClick={()=>setDisplay('block')}>Delete</button>
      </div>

      <div className='popup-wrapper-convo' style={{display: display}}>
        <div className="popup-convo">
          <div className='likes-header'>
            <i className="fas fa-times exit" onClick={()=>setDisplay('none')}></i>
            <p>Are you sure you want to delete this conversation?</p>
            <button className='convo-btn' onClick={deleteConversation}>Confirm</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Conversations;
