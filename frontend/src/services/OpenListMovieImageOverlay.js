// OpenMovieImageOverlay.js
import React, { useState, useRef } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";
import { PiCircleDuotone } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { BsHandThumbsUp } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";

const OpenMovieImageOverlay = ({ isOpen, movieData, closeOverlay }) => {
    const movieVideoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isAdded, setIsAdded] = useState(false);

    const handleMovieVideoPlayClick = () => {
        if (movieVideoRef.current) {
            movieVideoRef.current.play();
            if (movieVideoRef.current.requestFullscreen) {
                movieVideoRef.current.requestFullscreen();
                setIsPlaying(true);
            } else if (movieVideoRef.current.mozRequestFullScreen) { /* Firefox */
                movieVideoRef.current.mozRequestFullScreen();
                setIsPlaying(true);
            } else if (movieVideoRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                movieVideoRef.current.webkitRequestFullscreen();
                setIsPlaying(true);
            } else if (movieVideoRef.current.msRequestFullscreen) { /* IE/Edge */
                movieVideoRef.current.msRequestFullscreen();
                setIsPlaying(true);
            }
        }
    };

    const handleMovieVideoPauseClick = () => {
        if (movieVideoRef.current) {
            movieVideoRef.current.pause();
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { /* Firefox */
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE/Edge */
                    document.msExitFullscreen();
                }
            }
            setIsPlaying(false);
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    if (!isOpen) return null;

    const handleDeleteItem = async () => {
        try {
            const response = await fetch(`http://localhost:3000/auth/deleteListItem/${movieData._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            // refreshData();
            closeOverlay(); // Optionally close the overlay after deletion
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    

    return (
        <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-85 flex justify-center items-center" onClick={closeOverlay}>
            <div className='h-full w-1/2 bg-stone-900 overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                {movieData?.trailerVideo && (
                    <div className="relative w-full h-96">
                        <video
                            ref={movieVideoRef}
                            src={`http://localhost:3000/${movieData.trailerVideo.replace(/\\/g, '/').replace('public/', '')}`}
                            poster={movieData.trailerVideoPoster ? `http://localhost:3000/${movieData.trailerVideoPoster.replace(/\\/g, '/').replace('public/', '')}` : ''}
                            className="w-full h-full object-cover"
                            onEnded={handleVideoEnded}
                        />
                        {!isPlaying ? (
                            <div className="absolute inset-0 flex justify-center items-center text-white" onClick={handleMovieVideoPlayClick}>
                                <div className="group">
                                    <FaPlay className="relative top-16 left-8 text-4xl transition-colors duration-300 ease-in-out group-hover:text-red-700" />
                                    <PiCircleDuotone className="text-8xl transform transition-transform duration-700 ease-in-out group-hover:scale-110" />
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex justify-center items-center text-white" onClick={handleMovieVideoPauseClick}>
                                <div className="group">
                                    <FaPause className="relative top-16 left-7 text-4xl transition-colors duration-300 ease-in-out group-hover:text-red-700" />
                                    <PiCircleDuotone className="text-8xl transform transition-transform duration-700 ease-in-out group-hover:scale-110" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="m-8 p-4 text-white">
                    <RxCross2 className='text-3xl fixed top-5 right-1/4 mr-9 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-150' onClick={closeOverlay} />

                    <h2 className="text-3xl font-bold">{movieData.name}</h2>
                    {movieData ? (
                        <>
                            <p className="mt-2 text-zinc-400">{movieData.details}</p>
                            <p className="mt-2 text-zinc-400">Cast: {movieData.cast}</p>
                            <p className="mt-2 text-zinc-400">Creators: {movieData.creators}</p>

                            <div className='flex text-zinc-400 items-center space-x-6 mt-6 mb-16'>
                                <div className='flex flex-col items-center hover:text-zinc-300 cursor-pointer' onClick={handleDeleteItem} >
                                    {isAdded ? (
                                        <FaCheck className='text-4xl' />
                                    ) : (
                                        <AiOutlineDelete className='text-4xl' />
                                    )}
                                    <p className='text-lg mt-2'>{isAdded ? 'Added' : 'My List'}</p>
                                </div>
                                <div className='flex flex-col items-center hover:text-zinc-300 cursor-pointer'>
                                    <BsHandThumbsUp className='text-4xl' />
                                    <p className='text-lg mt-2'>Rate</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="mt-2 text-zinc-400">Loading movie details...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OpenMovieImageOverlay;
