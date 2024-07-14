import React, { useState } from 'react';
import { IoReorderThreeOutline, IoSearch } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import logo from "../assets/netflix.png";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Search = ({ closeSearchOverlay }) => {
    return (
        <div className="flex">
            <IoMdArrowRoundBack className='text-4xl m-8'/>            
            <div className="flex items-center justify-center space-x-2">
                <IoSearch className='text-4xl'/>
                <input 
                    type="text" 
                    className="bg-black text-white font-bold border-4 border-red-600 outline-none px-3 py-1 rounded-lg" 
                    placeholder="Search..."  
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}

const Header = () => {
    const navigate = useNavigate();
    const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

    const openSearchOverlay = () => {
        setIsSearchOverlayOpen(true);
    };

    const closeSearchOverlay = () => {
        setIsSearchOverlayOpen(false);
    };

    return (
        <div className='flex bg-black text-white py-6 px-4 justify-between'>
            <div className='flex'>
                <IoReorderThreeOutline className='text-4xl'/>
                <img src={logo} className='h-10 px-2'/>
            </div>
            <div className='flex items-center px-8 space-x-8 text-2xl font-bold'> 
                <p className="hover:text-yellow-500 hover:cursor-pointer transition duration-300"
                    onClick={() => navigate("/devpage")}>
                    Developer
                </p>
                <IoSearch className='cursor-pointer'
                    onClick={openSearchOverlay}  
                />
                <BsThreeDots className=''/>
            </div>
            {isSearchOverlayOpen && (
                <>
                <Search closeSearchOverlay={closeSearchOverlay} />
                <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-75 z-50"
                    onClick={closeSearchOverlay}  
                    >
                </div>
                </>
            )}
        </div>
    );
}

export default Header;
