import React from 'react';
import SignImg from '../assets/SignIn.jpg'; 
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const navigate=useNavigate();
  return (
    <div className='relative h-screen'>
      <img 
        src={SignImg} 
        alt='Sign In Background' 
        className='absolute inset-0 w-full h-full object-cover'
        style={{ filter: "brightness(40%)" }}
      />
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='bg-black bg-opacity-75 p-8 rounded-md text-white w-80'>
            <h2 className='text-3xl mb-6'>Sign In</h2>
            <input 
                type='email' 
                placeholder='Email' 
                className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
            />
            <input 
                type='password' 
                placeholder='Password' 
                className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
            />
            <button className='w-full py-3 bg-red-600 rounded text-white font-semibold'>Sign In</button>
            <div className='flex justify-between items-center mt-4 text-sm text-gray-400'>
                <label className='flex items-center'>
                    <input type='checkbox' className='mr-1' /> Remember me
                </label>
                <a href='https://help.netflix.com/en' className='hover:underline'>Need help?</a>
            </div>
            <div className='flex mt-6 space-x-2'>
                <p className='text-gray-400'>New in Netflix?</p>
                <p className='hover:underline cursor-pointer' onClick={()=>navigate("/signup")}>Sign up now</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
