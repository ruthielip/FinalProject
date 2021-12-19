import './Elements.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Post from '../post/Post';

const Elements = (props) => {
  const { post } = props;
  const [user, setUser] = useState({});
  const {user: currentUser} = useContext(AuthContext);
  const [photo, setPhoto] = useState('none');
  const [posts, setPosts] = useState([post]);
  const [zoom, setZoom] = useState('none');
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(()=>{
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data)
    }
    fetchUser()
  }, [post.userId]);

  const handleDisplay = () => {
    if(zoom === 'none'){
      setZoom('block')
    } else {
      setZoom('none')
    }
  }

  return (
    <>
      <div>
         <img style=
         {{width: '330px',
         height: '330px',
         objectFit: 'cover',
         cursor: 'pointer',
         borderRadius: '2px'}}
         src={PF + post.img}
         alt=''
         className='profile-image'
          onClick={handleDisplay}/>
      </div>

      <div className='popup-wrapper-elm' style={{display: zoom}}>
      <div className='popup-elm'>
      {posts.map((item, i)=>{
        return (
          <div key={i}>
            <Post post={item} />
            <i className="fas fa-times exit-elm" onClick={handleDisplay}></i>
          </div>
        )
      })}
      </div>
      </div>

    </>
  )
}

export default Elements;
