import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {loginCall} from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [wrongInfo, setWrongInfo] = useState('none');
  const [accounts, setAccounts] = useState([]);
  const {isFetching, dispatch, error} = useContext(AuthContext);

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

  const handleClick = (e) => {
    e.preventDefault();
    loginCall({email: email.current.value, password: password.current.value}, dispatch)
  }

console.log();

  return (
    <div className='bg'>
       <div className='main'>
          <form className='wrapper' onSubmit={handleClick}>
             <h3 className='login-title'>FinalProject</h3>
             <p className='wrong-info' style={{display: wrongInfo}}>Wrong Email or Password</p>
             <input type='email' required placeholder='Email' ref={email}/>
             <input type='password' minLength='6' placeholder='Password' ref={password}/>
             <button type='submit' className='button'>{isFetching ? <CircularProgress color="inherit" size='25px'/> : 'Log In'}</button>
             <p className='login-p'>Don't have an account?</p>
             <Link to='/register'>
                <p>Sign up</p>
             </Link>
          </form>
       </div>
    </div>
  )
}

export default Login;
