import React, { useState, useEffect } from 'react';
import { IoReorderThreeOutline, IoSearch } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import logo from "../assets/netflix.png";
import { useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { TiArrowShuffle } from "react-icons/ti";
import { AiOutlineRise } from "react-icons/ai";
import { RiComputerLine } from "react-icons/ri";
import { BiMovie } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useCookies } from "react-cookie";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { makeAuthenticatedGETRequest } from '../utils/serverHelpers';

const SmileyFace = () => {
    return (
        <div className="relative w-16 h-16 rounded-lg bg-blue-500 flex items-center justify-center">
            {/* Eyes */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full"></div>
            {/* Mouth */}
            <div className="absolute bottom-4 right-4 w-6 h-6 border-4 border-t-0 border-x-0 rounded-full"></div>
        </div>
    );
}

const Sidebar = ({ isOpen, closeSidebar }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [cookies, , removeCookie] = useCookies(["token"]);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userData = await makeAuthenticatedGETRequest(
              "/auth/profileDetails"
            );
            setUser(userData);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Handle error here
          }
        };
    
        fetchUserData();
      }, [cookies.token]);

    const handleLogout = (req, res) => {
        removeCookie("token");
        removeCookie("isLoggedIn");
        navigate("/");
      };

    return (
        <div className="fixed top-0 left-0 w-1/3 h-screen bg-black text-white z-50">
            <div className="p-4 relative">
                <RxCross2
                    className="absolute top-4 right-4 font-bold text-gray-400 text-3xl cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-150"
                    onClick={closeSidebar}
                />
                <h2 className="text-2xl font-bold">Menu</h2> 
                <div className='mt-8 ml-12 flex space-x-4 items-center hover:font-bold cursor-pointer'>
                    <SmileyFace />
                    <div>
                        {user && (
                            <p className='text-xl'>{user.username}</p>
                        )}
                        <p className='text-xl hover:text-white text-zinc-400'>Switch Profile</p>
                    </div>
                </div>
                <ul className="mt-8 ml-12">
                    <li className='flex items-center space-x-8 py-3 px-4 text-xl text-zinc-400 hover:text-white hover:font-bold cursor-pointer'> <IoSearch/> <p>Search</p></li>
                    <li className='flex items-center space-x-8 py-3 px-4 text-xl text-zinc-400 hover:text-white hover:font-bold cursor-pointer' onClick={()=>navigate("/Home")}> <GoHome /> <p>Home</p></li>
                    <li className='flex items-center space-x-8 py-3 px-4 text-xl text-zinc-400 hover:text-white hover:font-bold cursor-pointer'><TiArrowShuffle /> <p>Play Something</p></li>
                    <li className='flex items-center space-x-8 py-3 px-4 text-xl text-zinc-400 hover:text-white hover:font-bold cursor-pointer'><AiOutlineRise /> <p>New & Popular</p></li>
                    <li className='flex items-center space-x-8 py-3 px-4 text-xl text-zinc-400 hover:text-white hover:font-bold cursor-pointer'><RiComputerLine /> <p>TV Shows</p></li>
                    <li className='flex items-center space-x-8 py-3 px-4 text-xl text-zinc-400 hover:text-white hover:font-bold cursor-pointer'><BiMovie /> <p>Movies</p></li>
                    <li className='flex items-center space-x-8 py-3 px-4 text-xl text-zinc-400 hover:text-white hover:font-bold cursor-pointer'
                        onClick={()=>navigate("/myList")}>
                        <FaPlus /> 
                        <p>My List</p>
                    </li>
                </ul>
                <p className='flex items-center space-x-8 py-3 px-4 text-lg text-zinc-400 hover:text-white hover:font-bold cursor-pointer pt-24'>Setting</p>
                <p className='flex items-center space-x-8 py-3 px-4 text-lg text-zinc-400 hover:text-white hover:font-bold cursor-pointer' 
                    onClick={handleLogout}
                >Exit Netflix/Logout</p>
            </div>
        </div>
    );
};

const Dropdown = ({ isOpen }) => {
    const navigate = useNavigate();
    const [, , removeCookie] = useCookies(["token"]);

    const handleLogout = (req, res) => {
        removeCookie("token");
        removeCookie("isLoggedIn");
        navigate("/");
      };

    return (
        isOpen && (
            <div className="fixed z-50 absolute top-16 right-8 bg-black text-gray-400 shadow-lg rounded-lg w-48">
                <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-700 hover:text-white cursor-pointer flex items-center space-x-2"><CgProfile/> <p>Profile</p></li>
                    <li className="px-4 py-2 hover:bg-gray-700 hover:text-white cursor-pointer flex items-center space-x-2">< IoSettingsOutline /> <p>Settings</p></li>
                    <li className="px-4 py-2 hover:bg-gray-700 hover:text-white cursor-pointer flex items-center space-x-2" onClick={handleLogout}>< RiLogoutCircleLine /><p>Logout</p></li>
                </ul>
            </div>
        )
    );
};

const Header = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div className='flex bg-black text-gray-400 py-6 px-4 justify-between'>
            <div className='flex items-center'>
                <IoReorderThreeOutline className='text-4xl cursor-pointer' onClick={toggleSidebar}/>
                <img src={logo} className='h-10 px-2'/>
            </div>
            <div className='flex items-center px-8 space-x-8 text-2xl font-bold'> 
                <p className="hover:text-white hover:cursor-pointer transition duration-300"
                    onClick={() => navigate("/devpage")}>
                    Developer
                </p>
                <IoSearch className='cursor-pointer'/>
                <BsThreeDots className='cursor-pointer hover:text-white' onClick={toggleDropdown} />
            </div>
            {isSidebarOpen && (
                <>
                    <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-75 z-40"
                        onClick={closeSidebar}  
                    />
                </>
            )}
            {isDropdownOpen && (
                <>
                    <Dropdown isOpen={isDropdownOpen} closeDropdown={closeDropdown} />
                    <div className="fixed top-0 left-0 w-screen h-screen bg-transparent z-40"
                        onClick={closeDropdown}  
                    />
                </>
            )}
        </div>
    );
}

export default Header;
