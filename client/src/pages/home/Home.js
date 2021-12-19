import Navbar from '../../components/navbar/Navbar';
import Timeline from '../../components/timeline/Timeline';
import './Home.css';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const {user} = useContext(AuthContext);

  return (
    <>
      <Navbar />
    <div className='home'>
      <Timeline />
    </div>
    </>
  )
}

export default Home;
