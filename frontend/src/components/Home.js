import React, { useState, useEffect, useRef } from 'react';
import Header from "./Header";
import { TfiPlus } from "react-icons/tfi";
import { BsHandThumbsUp } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { FaPlay } from "react-icons/fa";
import { PiCircleDuotone } from "react-icons/pi";
import RandomVideo from './RandomVideo';

function Home() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageOverlayOpen, setImageOverlayOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [seriesData, setSeriesData] = useState(null); // State to hold series details

    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);

    const videoRef = useRef(null); // Ref to reference the video element
    const dropdownRef = useRef(null); // Ref for the dropdown

    const [isPlaying, setIsPlaying] = useState(false);
    const trailerVideoRef = useRef(null); // Ref for trailer video element

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/getAllImages');
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json();

                const adjustedImages = data.map(image => ({
                    ...image,
                    imageUrl: `${image.imageUrl.replace(/\\/g, '/').replace('public/', '')}`,
                }));

                setImages(adjustedImages);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                videoRef.current.forEach(video => {
                    if (video.current) {
                        video.current.pause();
                    }
                });
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                videoRef.current.forEach(video => {
                    if (video.current) {
                        video.current.pause();
                    }
                });
            }
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                console.log("Clicked outside dropdown, closing it.");
                setDropdownOpen(false);
            } else {
                console.log("Clicked inside dropdown.");
            }
        };

        // Set default season if available
        if (seasons.length > 0) {
            setSelectedSeason(seasons[0]); // Select the first season by default
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('mousedown', handleClickOutside);

        fetchImages();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [seasons]);

    const openImageOverlay = async (image) => {
        setSelectedImage(image);
        try {
            const response = await fetch(`http://localhost:3000/auth/getSeriesDetails/${image._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch series details');
            }
            const seriesData = await response.json();
            setSeriesData(seriesData);
            
            // Set seasons and default to the first season
            setSeasons(seriesData.seasons);
            const defaultSeason = seriesData.seasons[0]; // Assuming the first season should be default
            setSelectedSeason(defaultSeason);

            // Fetch episodes for the default season
            const episodesResponse = await fetch(`http://localhost:3000/auth/getEpisodes/${defaultSeason._id}`);
            if (!episodesResponse.ok) {
                throw new Error('Failed to fetch episodes');
            }
            const episodesData = await episodesResponse.json();
            setEpisodes(episodesData);
            
        } catch (error) {
            console.error('Error fetching series details:', error);
        }
        setImageOverlayOpen(true);
    };


    const closeImageOverlay = () => {
        setSelectedImage(null);
        setImageOverlayOpen(false);
        setSeriesData(null); // Clear series details when overlay is closed
        setSeasons([]);
        setEpisodes([]);
        setIsPlaying(false);
        setSelectedSeason(null); // Reset selected season to null
        setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleSeasonSelect = async (season) => {
        try {
            const response = await fetch(`http://localhost:3000/auth/getEpisodes/${season._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch episodes');
            }
            const episodesData = await response.json();
            setEpisodes(episodesData);
            setSelectedSeason(season); // Store the entire season object
            setDropdownOpen(false);
        } catch (error) {
            console.error('Error fetching episodes:', error);
        }
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

    return (
        <div>
            <Header />
            <RandomVideo />
            <div className="container mx-auto pb-8 bg-zinc-800">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {images.map((image, index) => (
                        <div key={index} className="p-4 shadow-md rounded-lg bg-black cursor-pointer" onClick={() => openImageOverlay(image)}>
                            <img
                                className="w-full h-full rounded-lg object-cover"
                                src={image.imageUrl}
                                alt={`${image.seriesName} Poster`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && isImageOverlayOpen && (
                <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-85 flex justify-center items-center" onClick={closeImageOverlay}>
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
                            <RxCross2 className='text-3xl fixed top-5 right-1/4 mr-9 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-150' onClick={closeImageOverlay} />

                            <h2 className="text-3xl font-bold">{seriesData.seriesName}</h2>
                            {seriesData ? (
                                <>
                                    <p className="mt-2 text-zinc-400">{seriesData.seriesDetails}</p>
                                    <p className="mt-2 text-zinc-400">Cast: {seriesData.seriesCast}</p>
                                    <p className="mt-2 text-zinc-400">Creators: {seriesData.seriesCreators}</p>

                                    <div className='flex text-zinc-400 items-center space-x-6 mt-6 mb-16'>
                                        <div className='flex flex-col items-center hover:text-zinc-300 cursor-pointer'>
                                            <TfiPlus className='text-4xl' />
                                            <p className='text-lg mt-2'>My List</p>
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
            )}
        </div>
    );
}

export default Home;
