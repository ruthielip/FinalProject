import './Share.css'
import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { axiosInstance } from '../../config';

const Share = () => {
  const {user} = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value
    }
    if(file){
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append('name', fileName);
      data.append('file', file);
      newPost.img = fileName;
      try{
        await axiosInstance.post('/upload', data)
      }catch(err){
        console.log(err);
      }
    }
    try {
      await axiosInstance.post('/posts', newPost);
      window.location.reload();
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='share'>
       <form className='share-wrapper' onSubmit={submitHandler}>

       <label htmlFor='file' className='add-post'>
          <i className="far fa-plus-square"></i>
          <span className='newpost'>New post</span>
          <input type='file' className='file' id='file' accept='.png, .jpeg, .jpg' onChange={(e)=>setFile(e.target.files[0])}/>
       </label>

          <div className='caption'>
             <textarea className='textarea-share' rows="2" cols="20" wrap="hard" placeholder='Write a caption...' ref={desc}></textarea>
          </div>

          {file && (
            <div className='file-share'>
               <img src={URL.createObjectURL(file)} alt=''/>
               <i className="fas fa-times exit" onClick={()=>setFile(null)}></i>
            </div>
          )}

          <div className='share-button'>
             <button type='submit'>Share</button>
          </div>
       </form>
    </div>
  )
}

export default Share;
