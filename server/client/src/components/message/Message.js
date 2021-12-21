import './Message.css';
import { format } from 'timeago.js';
import { useEffect, useState } from 'react';
import axiosInstance from '../../config';
import { Link } from 'react-router-dom'

const Message = ( {message, own }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [accounts, setAccounts] = useState([]);

  useEffect(()=>{
    const fetchUsers = async () => {
      try{
        const res = await axiosInstance.get('/users/all');
        setAccounts(res.data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchUsers();
  },[]);

  return(
    <div className={own ? 'message own' : 'message'}>
      <div className='message-top'>

      {accounts.map((acc, i)=>{
          if(acc._id === message.sender){
            return(
              <Link key={i}  to={`../profile/${acc.username}`}>
              <img className='message-img' src={acc.profilePicture ? PF + acc.profilePicture : PF + 'pp.png'} alt=''/>
              </Link>
            )} else {
              return null;
            }
        })}

        <p className='message-text'>{message.text}</p>

      </div>
      <div className='message-bottom'>
        <p className='message-time'>{format(message.createdAt)}</p>
      </div>
    </div>
  )
}

export default Message;
