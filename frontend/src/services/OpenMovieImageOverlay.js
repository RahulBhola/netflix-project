// OpenMovieImageOverlay.js
import React, { useState, useRef } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";
import { PiCircleDuotone } from "react-icons/pi";
import { TfiPlus } from "react-icons/tfi";
import { RxCross2 } from "react-icons/rx";
import { BsHandThumbsUp } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";

const OpenMovieImageOverlay = ({ isOpen, movieData, closeOverlay, picture }) => {
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

    const handleAddToList = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/addToList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'movie',
                    name: movieData.movieName,
                    details: movieData.movieDetails,
                    cast: movieData.movieCast,
                    creators: movieData.movieCreators,
                    picture: picture,
                    trailerVideo: movieData.movieVideo,
                    trailerVideoPoster: movieData.movieVideoPoster,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to add to list');
            }
            const result = await response.json();
            console.log('Successfully added to list:', result);
            setIsAdded(true);

        } catch (error) {
            console.error('Error adding to list:', error);
        }
    };
    
    

    return (
        <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-85 flex justify-center items-center" onClick={closeOverlay}>
            <div className='h-full w-1/2 bg-stone-900 overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                {movieData?.movieVideo && (
                    <div className="relative w-full h-96">
                        <video
                            ref={movieVideoRef}
                            src={`http://localhost:3000/${movieData.movieVideo.replace(/\\/g, '/').replace('public/', '')}`}
                            poster={movieData.movieVideoPoster ? `http://localhost:3000/${movieData.movieVideoPoster.replace(/\\/g, '/').replace('public/', '')}` : ''}
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

                    <h2 className="text-3xl font-bold">{movieData.movieName}</h2>
                    {movieData ? (
                        <>
                            <p className="mt-2 text-zinc-400">{movieData.movieDetails}</p>
                            <p className="mt-2 text-zinc-400">Cast: {movieData.movieCast}</p>
                            <p className="mt-2 text-zinc-400">Creators: {movieData.movieCreators}</p>

                            <div className='flex text-zinc-400 items-center space-x-6 mt-6 mb-16'>
                                <div className='flex flex-col items-center hover:text-zinc-300 cursor-pointer' onClick={handleAddToList}>
                                    {isAdded ? (
                                        <FaCheck className='text-4xl' />
                                    ) : (
                                        <TfiPlus className='text-4xl' />
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
