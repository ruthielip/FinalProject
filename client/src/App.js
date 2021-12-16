import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/login/Register';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import './App.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <BrowserRouter>
         <Routes>
            <Route path='/' element={user ? <Home/> : <Login />}/>
            <Route path='/profile/:username' element={<Profile/>}/>
            <Route path='/login' element={user ? <Navigate to='/'/> : <Login/>}/>
            <Route path='/register' element={user ? <Navigate to='/'/> : <Register/>}/>
         </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
