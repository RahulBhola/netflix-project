import React,{useState} from 'react';
import SignImg from '../assets/SignIn.jpg'; 
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { makeUnauthenticatedPOSTRequest } from '../utils/serverHelpers';

function SignIn() {
    const navigate=useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const [, setCookie] = useCookies(["token"]);


    const login = async() => {
      const data = { email, password };
      const response = await makeUnauthenticatedPOSTRequest("/auth/login", data);

      if (response && !response.err) {
        const token = response.token;
        const date = new Date();
        date.setDate(date.getDate() + 30);
        setCookie("token", token, { path: "/", expires: date });
        setCookie("isLoggedIn", true, {path: "/" , expires: date});
        alert("Success");
        navigate("/home");
      } else {
        alert("Failure");
      }
    };

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
                id='email'
                type='email' 
                placeholder='Email' 
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
                className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
            />
            <input
                id={password} 
                type='password' 
                placeholder='Password' 
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
                className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
            />
            <button className='w-full py-3 bg-red-600 rounded text-white font-semibold'  
                onClick={(e) => {
                  e.preventDefault();
                  login();
                }}>Sign In</button>
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
