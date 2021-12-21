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
  const {isFetching, dispatch, error, user} = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await loginCall({email: email.current.value, password: password.current.value}, dispatch);
    } catch(err) {
      console.log(err);
    }
    setWrongInfo('block')
  }

  return (
    <div className='bg'>
       <div className='main'>
          <form className='wrapper' onSubmit={handleClick}>
             <h3 className='login-title'>Artistree</h3>
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
