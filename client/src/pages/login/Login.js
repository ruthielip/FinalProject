import './Login.css';
import { Link } from 'react-router-dom';
import { useRef, useContext } from 'react';
import {loginCall} from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
  const email = useRef();
  const password = useRef();
  const {isFetching, error, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall({email: email.current.value, password: password.current.value}, dispatch)
  }

  return (
    <div className='bg'>
       <div className='main'>
          <form className='wrapper' onSubmit={handleClick}>
             <h3 className='login-title'>FinalProject</h3>
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
