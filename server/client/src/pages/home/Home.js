import Navbar from '../../components/navbar/Navbar';
import Timeline from '../../components/timeline/Timeline';
import './Home.css';

const Home = () => {

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
