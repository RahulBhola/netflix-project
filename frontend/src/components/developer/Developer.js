import React from 'react';
import { useNavigate } from "react-router-dom";

const Developer = () => {
  const navigate = useNavigate();

  return (
    <div className='flex h-screen bg-black'>
      <div className='m-auto  gap-52 grid grid-cols-2 gap-4 place-content-center text-white font-bold text-3xl'>

        <p className='bg-red-700 rounded-full px-12 py-8 hover:text-amber-300 hover:bg-yellow-950 cursor-pointer'
          onClick={() => { navigate("/devpage/series") }}>Add New Series</p>

        <p className='bg-red-700 rounded-full px-12 py-8 hover:text-amber-300 hover:bg-yellow-950 cursor-pointer'
         onClick={() => { navigate("/devpage/new-season") }}>Add New Season</p>

        <p className='bg-red-700 rounded-full px-12 py-8 hover:text-amber-300 hover:bg-yellow-950 cursor-pointer'
          onClick={() => { navigate("/devpage/updateseason") }}>Update Season</p>
          
        <p className='bg-red-700 rounded-full px-12 py-8 hover:text-amber-300 hover:bg-yellow-950 cursor-pointer'>Add New Movie</p>
      </div>
    </div>
  );
}

export default Developer;
