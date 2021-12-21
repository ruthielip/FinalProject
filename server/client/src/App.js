import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/login/Register';
import Messenger from './pages/messenger/Messenger';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useContext, useState } from 'react';
import useScroll from "./useScroll";
import './App.css';

function App() {
  const { user } = useContext(AuthContext);
  const [loading] = useState(false);
  useScroll(loading);

  return (
    <div>
      <BrowserRouter>
         <Routes>
            <Route path='/' element={user ? <Home/> : <Login />}/>
            <Route path='/profile/:username' element={<Profile/>}/>
            <Route path='/login' element={user ? <Navigate to='/'/> : <Login/>}/>
            <Route path='/register' element={user ? <Navigate to='/'/> : <Register/>}/>
            <Route path='/messenger' element={user ? <Messenger/>  : <Navigate to='/'/>}/>
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
