import React,{useState} from 'react';
import SignImg from '../assets/SignIn.jpg';
import { useNavigate } from 'react-router-dom';
import {makeUnauthenticatedPOSTRequest} from "../utils/serverHelpers";
import { useCookies } from "react-cookie";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setCookie] = useCookies(["token"]);

  const signUp = async() => {
    if(password !== confirmPassword){
      alert("Password and confirm Password fields must match. Please check again");
      return;
    }
    const data = {username,email,password};
    const response = await makeUnauthenticatedPOSTRequest("/auth/register", data);
    if (response && !response.err) {
      const token = response.token;

      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });

      alert("Success");
      navigate("/home");
    } else {
      alert("Failure");
    }
  }
  return (
    <div className='relative h-screen'>
      <img
        src={SignImg}
        alt='Sign Up Background'
        className='absolute inset-0 w-full h-full object-cover'
        style={{ filter: "brightness(40%)" }}
      />
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='bg-black bg-opacity-75 p-8 rounded-md text-white w-80'>
          <h2 className='text-3xl mb-6'>Sign Up</h2>
          <input
            id='username'
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => {setUsername(e.target.value)}}
            className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
          />
          <input
            id='email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => {setEmail(e.target.value)}}
            className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
          />
          <input
            id='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => {setPassword(e.target.value)}}
            className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
          />
          <input
            id='confirmPassword'
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => {setConfirmPassword(e.target.value)}}
            className='w-full p-3 mb-4 bg-gray-700 bg-opacity-50 rounded text-white outline-none'
          />
          <button className='w-full py-3 bg-red-600 rounded text-white font-semibold'
            onClick={(e) => {
              e.preventDefault();
              signUp();
            }}>Sign Up</button>

          <div className='flex mt-6 space-x-2'>
            <p className='text-gray-400'>Already have an account?</p>
            <p className='hover:underline cursor-pointer' onClick={() => navigate("/signin")}>Sign In</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
