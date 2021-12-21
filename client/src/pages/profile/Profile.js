import './Profile.css';
import Navbar from '../../components/navbar/Navbar';
import Display from '../../components/display/Display';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [display, setDisplay] = useState('none');
  const [display2, setDisplay2] = useState('none');
  const [displayDesc, setDisplayDesc] = useState('none')
  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const {user: currentUser, dispatch} = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState('');
  const username = useParams().username;
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [description, setDescription] = useState('');
  const [followButton, setFollowButton] = useState('');
  const [conversations, setConversations] = useState([]);
  const [mutualConversations, setMutualConversations] = useState([]);

  useEffect(()=>{
    setIsFollowing(currentUser.following.includes(user?._id))
  },[user, currentUser])

  useEffect(()=>{
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data)
    }
    fetchUser()
  }, [username]);

  useEffect(()=>{
    const getFriends = async ()=>{
      try{
        const friendList = await axios.get(`/users/friends/${user._id}`)
        setFriends(friendList.data);
      }catch(err){
        console.log(err);
      }
    };
    getFriends();
  }, [user])

  useEffect(()=>{
    const getFollowers = async ()=>{
      try{
        const followersList = await axios.get(`/users/followers/${user._id}`)
        setFollowers(followersList.data);
      }catch(err){
        console.log(err);
      }
    };
    getFollowers();
  }, [user])

  useEffect(()=>{
      if(isFollowing){
        setFollowButton('unfollow-button')
      } else {
        setFollowButton('following-button')
      }
  },[isFollowing])

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
  }, [user]);

  useEffect(()=>{
    setMutualConversations(conversations.filter((c)=>c.members.includes(currentUser._id)))
  },[conversations])

  const showFollowing = (e) => {
    e.preventDefault();
    setDisplay('block');
  }

  const hideFollowing = (e) => {
    e.preventDefault();
    setDisplay('none');
  }

  const showFollowers = (e) => {
    e.preventDefault();
    setDisplay2('block');
  }

  const hideFollowers = (e) => {
    e.preventDefault();
    setDisplay2('none');
  }

  const showDesc = () => {
    if(displayDesc === 'none'){
      setDisplayDesc('block')
    } else {
      setDisplayDesc('none')
    }
  }

  const hideDesc = () => {
    setDisplayDesc('none')
  }

  const updateProfilePic = async (e) => {
    e.preventDefault();
    const newProfilePic = {
      userId: user._id
    }
    if(profileFile){
      const data = new FormData();
      const profileName = Date.now() + profileFile.name;
      data.append('name', profileName);
      data.append('file', profileFile);
      newProfilePic.profilePicture = profileName;
      try{
        await axios.post('/upload', data)
      } catch(err) {
        console.log(err);
      }
    }
    try {
      await axios.put(`/users/${user._id}`, newProfilePic);
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  }

  const updateCoverPic = async (e) => {
    e.preventDefault();
    const newCoverPic = {
      userId: user._id
    }
    if(coverFile){
      const data = new FormData();
      const coverName = Date.now() + coverFile.name;
      data.append('name', coverName);
      data.append('file', coverFile);
      newCoverPic.coverPicture = coverName;
      try{
        await axios.post('/upload', data)
      } catch(err) {
        console.log(err);
      }
    }
    try {
      await axios.put(`/users/${user._id}`, newCoverPic);
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  }

  const editDesc = async (e) => {
    e.preventDefault();
    const newDesc = {
      userId: user._id
    }
    newDesc.desc = description;
    try {
      await axios.put(`/users/${user._id}`, newDesc);
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  }

  const newConvo = async () =>{
    const newConversation = {
      members: [currentUser._id, user._id]
    }
     try{
       await axios.post('/conversations', newConversation)
     }catch(err){
       console.log(err);
     }
  }

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
    }
  };

  return (
    <div onLoad={hideFollowing}>
      <Navbar/>
      <div onLoad={hideFollowers} className='profile'>
      <div className='photos'>
         <img src={user.coverPicture ? PF + user.coverPicture : PF + 'cp.jpg'} alt='coverPhoto' className='coverPhoto'/>
         {
           <>
           <label htmlFor='cover-file' className='add-post'>
           {user._id === currentUser._id && <div className='upload-cover'><i className="fas fa-camera"></i><p>Change Cover Photo</p></div>}
           <input type='file' className='file' id='cover-file' accept='.png, .jpeg, .jpg' onChange={(e)=>setCoverFile(e.target.files[0])}/>
           </label>

             {coverFile && (
               <form onSubmit={updateCoverPic} className='profile-share'>
                  <img src={URL.createObjectURL(coverFile)} alt=''/>
                  <i className="fas fa-times-circle" onClick={()=>setCoverFile(null)}></i>
                  <button type='submit'>Add Cover Photo</button>
               </form>
             )}
           </>
         }

         <img src={user.profilePicture ? PF + user.profilePicture : PF + 'pp.png'} alt='profilePicture' className='profilePicture'/>
         {
           <>
           <label htmlFor='profile-file' className='add-post'>
           {user._id === currentUser._id && <div className='plus'><i className="fas fa-camera"></i></div>}
           <input type='file' className='file' id='profile-file' accept='.png, .jpeg, .jpg' onChange={(e)=>setProfileFile(e.target.files[0])}/>
           </label>

           {profileFile && (
             <form onSubmit={updateProfilePic} className='profile-share'>
                <img src={URL.createObjectURL(profileFile)} alt=''/>
                <i className="fas fa-times-circle" onClick={()=>setProfileFile(null)}></i>
                <button type='submit'>Add Profile Picture</button>
             </form>
           )}
           </>
         }
      </div>

      <div className='info'>

         <div className='bio'>
            <h3>{user.username}</h3>
            <p style={{fontSize: '20px'}}>{user.desc}</p>
            <div className='profile-desc'>
            {
              user._id === currentUser._id &&
              <>
                <i className="fas fa-edit edit-bio"></i>
                <p className='edit-bio-txt' onClick={showDesc}> Edit Bio</p>
              </>
            }
            </div>

            <form className='edit-desc' style={{display: displayDesc}} onSubmit={editDesc}>
               <textarea className='textarea-bio' onChange={(e)=>setDescription(e.target.value)}></textarea><br/>
               <button type='submit' onClick={hideDesc}>Save</button>
            </form>

         </div>

         <div className='numbers'>
            <p className='numbers-followers' onClick={showFollowers}><strong>{followers.length}</strong> followers</p>

            <div className='popup-wrapper' style={{display: display2}}>
            <div className="popup" style={{display: display2}}>
            <div className='following-header'>
              <i className="fas fa-times exit" onClick={hideFollowers}></i>
              <h3>Followers</h3>
            </div>

            {followers.length === 0 ?
              <p className='zero-following'><strong>{user.username}</strong> has no followers</p> :
              <>
              {followers.map((friend, i)=>(
                <Link key={i} className='following-link' to={`/profile/${friend.username}`} onClick={() => window.location.href(`/profile/${friend.username}`)}>
                 <div className='following-container'>
                  <div className='following'>
                   <img src={friend.profilePicture ? PF + friend.profilePicture : PF + 'pp.png'} alt=''/>
                   <div className='following-info'>
                     <h4>{friend.username}</h4>
                     <p>{friend.desc}</p>
                   </div>
                  </div>
                 </div>
                </Link>
              ))}
            </>
            }

            </div>
            </div>

            <p onClick={showFollowing}><strong>{friends.length}</strong> following</p>

            <div className='popup-wrapper' style={{display: display}}>
            <div className="popup" style={{display: display}}>
            <div className='following-header'>
              <i className="fas fa-times exit" onClick={hideFollowing}></i>
              <h3>Following</h3>
            </div>

              {friends.length === 0 ?
                <p className='zero-following'><strong>{user.username}</strong> isn't following anyone</p> :
                <>
                {friends.map((friend, i)=>(
                  <Link key={i} className='following-link' to={`/profile/${friend.username}`} onClick={() => window.location.href(`/profile/${friend.username}`)}>
                  <div className='following-container'>
                  <div className='following'>
                     <img src={friend.profilePicture ? PF + friend.profilePicture : PF + 'pp.png'} alt=''/>
                     <div className='following-info'>
                       <h4>{friend.username}</h4>
                       <p>{friend.desc}</p>
                     </div>
                  </div>
                  </div>
                  </Link>
                ))}
                </>
              }
            </div>
            </div>

         </div>

         <div className='follow-button'>
            {user.username !== currentUser.username && (
              <button onClick={handleClick} className={followButton}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
            )}
            <Link to='/messenger'>
            {
              user.username !== currentUser.username &&mutualConversations.length > 0 ?
              <button className='message-button'>Message</button> : null
            }
            {
              user.username !== currentUser.username &&mutualConversations.length === 0 ?
              <button className='message-button' onClick={newConvo}>New Message</button> : null
            }
            </Link>
         </div>

      </div>
    </div>
    <Display username={username}/>
    </div>
  )
}

export default Profile;
