import './Messenger.css';
import Navbar from '../../components/navbar/Navbar';
import Conversations from '../../components/conversations/Conversations';
import Message from '../../components/message/Message';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const {user} = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(()=>{
    socket.current = io('ws://localhost:8800');
    socket.current.on('getMessage', data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now()
      });
    });
  },[]);

  useEffect(()=>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
    setMessages((prev) => [...prev, arrivalMessage])
  },[arrivalMessage, currentChat])

  useEffect(()=>{
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', users=>{
    })
  },[user])

  useEffect(()=>{
    const getConversations = async ()=>{
      try {
        const res = await axios.get(`/conversations/${user._id}`);
        setConversations(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(()=>{
    const getMessages = async () => {
      try{
        const res = await axios.get(`/messages/${currentChat?._id}`);
        setMessages(res.data)
      } catch(err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id
    };

    const receiverId = currentChat.members.find(member => member !== user._id);

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage
    });

    try{
      const res = await axios.post('/messages', message);
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch(err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return(
    <>
      <Navbar/>
      <div className='messenger'>
        <div className='chat-menu'>
          <div className='chat-menu-wrapper'>
            <h4 className='chats-title'>Chats</h4>
            {conversations.map((convo, i) =>(
              <div key={i} onClick={()=> setCurrentChat(convo)}>
                <Conversations conversation={convo} currentUser={user}/>
              </div>
            ))}
          </div>
        </div>
        <div className='chat-box'>
          <div className='chat-box-wrapper'>
          {
            currentChat ? (
              <>
              <div className='chat-box-top'>
              {messages.map((m, i) =>(
                <div key={i} ref={scrollRef}>
                  <Message message={m} own={m.sender === user._id} currentUser={user}/>
                </div>
              ))}
              </div>
              <div className='chat-box-bottom'>
                <textarea
                 onChange={(e)=>setNewMessage(e.target.value)}
                 value={newMessage} className='chat-textarea'
                 placeholder='Message...'>
                </textarea>
                <button className='chat-send' onClick={handleSubmit}>Send</button>
              </div>
              </>
            ) : (
              <p className='no-convo'>Open a coversation to start a chat.</p>
            )
          }
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger;
