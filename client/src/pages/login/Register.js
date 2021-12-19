import './Login.css';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

const Register = () => {
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const username = useRef();
  const navigate = useNavigate();
  const {isFetching, error, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    if(confirmPassword.current.value !== password.current.value){
      confirmPassword.current.setCustomValidity("Passwords don't match")
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value
      };
      try {
        await axios.post('auth/register', user);
        navigate('/login');
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className='bg'>
      <div className='main'>
       <form className='wrapper' onSubmit={handleClick}>
          <h3 className='login-title'>FinalProject</h3>
          <input placeholder='Username' required ref={username}/>
          <input type='email' placeholder='Email' required ref={email}/>
          <input type='password' placeholder='Password' minLength='6' required ref={password}/>
          <input type='password' placeholder='Confirm password' minLength='6' required ref={confirmPassword}/>
          <button type='submit' className='button'>{isFetching ? <CircularProgress color="inherit" size='25px'/> : 'Sign In'}</button>
          <p className='login-p'>Already have an account?</p>
          <Link to='/login'>
             <p>Log in</p>
          </Link>
       </form>
      </div>
    </div>
  )
}

export default Register;
