import './Navbar.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Share from '../share/Share';
import Select from 'react-select';
import axios from 'axios';

const Navbar = () => {
  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();
  const [display, setDisplay] = useState('none');
  const [share, setShare] = useState('none');
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const fetchUsers = async () => {
      try{
        const res = await axios.get('/users/all');
        setAccounts(res.data);
      } catch(err) {
        console.log(err);
      }
    }
    fetchUsers();
  },[]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  const getPopup = () => {
    if(display === 'none'){
      setDisplay('block')
    } else {
      setDisplay('none')
    }
  }

  const handleShare = () => {
    if(share === 'none'){
      setShare('block')
    } else {
      setShare('none')
    }
  }

  const usersArray = accounts.map(user=>(
    { label: <div>
             <Link to={`/profile/${user.username}`} style={{textDecoration: 'none', color: 'black'}} onClick={() => window.location.href(`/profile/${user.username}`)}>
             <div  className='search-react'>
             <img src={PF + user.profilePicture} height="40px" width="40px" style={{borderRadius: '50%', marginRight: '10px'}}/>
             <p>{user.username}</p>
             </div>
             </Link>
             </div>,
      value: user.username})
  );

  return (
    <div className='navbar'>
      <div className='nav-left'>
      <Link to='/' className='main-logo'>
         <span>FinalProject</span>
      </Link>
      </div>

      <div className='nav-center'>
         <Select placeholder='Search..' options={usersArray} className='search-users' control
         components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null}}/>
      </div>

      <div className='nav-right'>

        <div className='nav-icons'>
           <div className='icon'>
           <Link to='/'>
              <i className="fas fa-home" style={{color: 'black'}}></i>
           </Link>
           </div>
           <div className='icon'>
              <i className="far fa-user"></i>
              {/*<span className='pink-icon'>1</span>*/}
           </div>
           <div className='icon'>
              <i className="far fa-comment-dots"></i>
              {/*<span className='pink-icon'>2</span>*/}
           </div>
           <div className='icon'>
              <i className="far fa-heart"></i>
              {/*<span className='pink-icon'>5</span>*/}
           </div>

           <div className='icon'>
              <i className="far fa-plus-square" onClick={handleShare}></i>
              <div className='posting' style={{display: share}}>
              <i className="fas fa-times exit" onClick={handleShare}></i>
                <Share/>
              </div>
           </div>

           <div className='nav-picture'>
           <img src={user.profilePicture ? PF + user.profilePicture : PF + 'pp.png'} alt='profile' onClick={getPopup}/>

           <div className='user-options' style={{display: display}}>
              <Link to={`/profile/${user.username}`} style={{textDecoration: 'none'}}>
                 <div className='profile-wrapper'>
                   <i className="fas fa-user"></i>
                   <p className='profile-option'>Profile</p>
                 </div>
              </Link>
              <div className='profile-wrapper'>
                <i className="fas fa-sign-out-alt"></i>
                <p onClick={handleLogout}>Logout</p>
              </div>
           </div>

           </div>
        </div>


      </div>

    </div>
  )
}

export default Navbar;
