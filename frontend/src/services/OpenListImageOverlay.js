import React, { useState, useEffect, useRef } from 'react';
import { BsHandThumbsUp } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaPlay, FaPause } from "react-icons/fa";
import { PiCircleDuotone } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";


const OpenImageOverlay = ({ isOpen, seriesData, closeOverlay}) => {
    const trailerVideoRef = useRef(null); // Ref for trailer video element
    const videoRef = useRef(null); // Ref for video element
    const dropdownRef = useRef(null); // Ref for the dropdown

    const [seasons, setSeasons] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);

    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        if (seriesData) {
            setSeasons(seriesData.seasons);
            const initialSeason = seriesData.seasons[0];
            setSelectedSeason(initialSeason);

            // Fetch episodes for the initially selected season
            fetchEpisodes(initialSeason._id);
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                if (videoRef.current) {
                    videoRef.current.pause();
                }
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden && videoRef.current) {
                videoRef.current.pause();
            }
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [seriesData]);

    useEffect(() => {
        if (selectedSeason) {
            fetchEpisodes(selectedSeason._id);
        }
    }, [selectedSeason]);

    const fetchEpisodes = async (seasonId) => {
        try {
            const response = await fetch(`http://localhost:3000/auth/getEpisodesListItem/${seasonId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch episodes');
            }
            const episodesData = await response.json();
            setEpisodes(episodesData);
        } catch (error) {
            console.error('Error fetching episodes:', error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleSeasonSelect = (season) => {
        setSelectedSeason(season); // This will trigger the useEffect to fetch episodes
        setDropdownOpen(false);
    };

    const handlePlayClick = (videoUrl) => {
        if (videoRef.current) {
            videoRef.current.src = videoUrl;
            videoRef.current.play();
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.mozRequestFullScreen) { /* Firefox */
                videoRef.current.mozRequestFullScreen();
            } else if (videoRef.current.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) { /* IE/Edge */
                videoRef.current.msRequestFullscreen();
            }
        }
    };

    const handleTrailerVideoPlayClick = () => {
        if (trailerVideoRef.current) {
            trailerVideoRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error('Error playing trailer video:', error);
            });
        } else {
            console.error('Video element or play function not available.');
        }
    };

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    if (!isOpen) return null;

    const handleDeleteItem = async () => {
        try {
            const response = await fetch(`http://localhost:3000/auth/deleteListItem/${seriesData._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            // Refresh the page to reflect the changes
            window.location.reload();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    

    return (
        <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-85 flex justify-center items-center" onClick={closeOverlay}>
            <div className='h-full w-1/2 bg-stone-900 overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                {seriesData?.trailerVideo && (
                    <div className="relative w-full h-96">
                        <video
                            ref={trailerVideoRef}
                            src={`http://localhost:3000/${seriesData.trailerVideo.replace(/\\/g, '/').replace('public/', '')}`}
                            poster={seriesData.trailerVideoPoster ? `http://localhost:3000/${seriesData.trailerVideoPoster.replace(/\\/g, '/').replace('public/', '')}` : ''}
                            className="w-full h-full object-cover"
                            onEnded={handleVideoEnded}
                        />
                        {!isPlaying && (
                            <div className="absolute inset-0 flex justify-center items-center text-white" onClick={handleTrailerVideoPlayClick}>
                                <div className="group">
                                    <FaPlay className="relative top-16 left-8 text-4xl transition-colors duration-300 ease-in-out group-hover:text-red-700" />
                                    <PiCircleDuotone className="text-8xl transform transition-transform duration-700 ease-in-out group-hover:scale-110" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="m-8 p-4 text-white">
                    <RxCross2 className='text-3xl fixed top-5 right-1/4 mr-9 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-150' onClick={closeOverlay} />

                    <h2 className="text-3xl font-bold">{seriesData.name}</h2>
                    {seriesData ? (
                        <>
                            <p className="mt-2 text-zinc-400">{seriesData.details}</p>
                            <p className="mt-2 text-zinc-400">Cast: {seriesData.cast}</p>
                            <p className="mt-2 text-zinc-400">Creators: {seriesData.creators}</p>

                            <div className='flex text-zinc-400 items-center space-x-6 mt-6 mb-16'>
                                <div className='flex flex-col items-center hover:text-zinc-300 cursor-pointer'  onClick={handleDeleteItem}>
                                    {isAdded ? (
                                        <FaCheck className='text-4xl' />
                                    ) : (
                                        <AiOutlineDelete className='text-4xl' />
                                    )}
                                    <p className='text-lg mt-2'>{isAdded ? 'Removed' : 'Remove from List'}</p>
                                </div>
                                <div className='flex flex-col items-center hover:text-zinc-300 cursor-pointer'>
                                    <BsHandThumbsUp className='text-4xl' />
                                    <p className='text-lg mt-2'>Rate</p>
                                </div>
                            </div>

                            <div className='relative mt-6'>
                                <div ref={dropdownRef} className='absolute mt-4 -top-14 w-30 bg-zinc-700 text-zinc-300 z-10'>
                                    <button className='flex items-center space-x-2 text-zinc-300 border border-4 border-zinc-500 uppercase bg-zinc-700 pr-1' onClick={toggleDropdown}>
                                        <span className='px-2 py-1'>{selectedSeason ? `Season ${selectedSeason.seasonNumber}` : 'Select Season'}</span>
                                        <svg className={`w-4 h-4 transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                    {isDropdownOpen && (
                                        <ul>
                                            {seasons.map((season) => (
                                                <li key={season._id} className='px-4 py-2 hover:bg-zinc-800 cursor-pointer uppercase' onClick={() => handleSeasonSelect(season)}>
                                                    Season {season.seasonNumber}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className='mt-20'>
                                <ul className='grid grid-cols-2 gap-1'>
                                    {episodes.map((episode) => (
                                        <li key={episode._id} className='mt-2 text-zinc-400 hover:bg-stone-700 cursor-default hover:shadow-black hover:shadow-2xl'>
                                            <div className='m-1 relative cursor-pointer' onClick={() => handlePlayClick(episode.episodeVideo)}>
                                                <video
                                                    ref={videoRef}
                                                    src={episode.episodeVideo}
                                                    poster={episode.posterPicture}
                                                    preload="auto"
                                                    className="w-full opacity-95"
                                                />
                                                <div className="absolute top-10 left-32 text-white">
                                                    <div className="group">
                                                        <FaPlay className="relative top-10 left-5 text-2xl transition-colors duration-300 ease-in-out group-hover:text-red-700" />
                                                        <PiCircleDuotone className="text-6xl transform transition-transform duration-700 ease-in-out group-hover:scale-110" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='m-1'>
                                                <p className='text-zinc-100 my-2'>{episode.episodeName}</p>
                                                <p>{episode.videoDetails}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="mt-2 text-zinc-400">Loading series details...</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OpenImageOverlay
