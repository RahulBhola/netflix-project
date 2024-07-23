import React, { useState, useEffect, useRef } from 'react';
import { FaPlay } from "react-icons/fa";
import { TfiPlus } from "react-icons/tfi";
import { PiCircleDuotone } from "react-icons/pi";
import { BsHandThumbsUp } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

const Movies = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const [movieData, setMovieData] = useState(null);
    const [isMovieImageOverlayOpen, setMovieImageOverlayOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/getAllMovieImages');
                if (!response.ok) {
                    throw new Error('Failed to fetch movie images');
                }
                const data = await response.json();

                const adjustedImages = data.map(image => ({
                    ...image,
                    imageUrl: `${image.imageUrl.replace(/\\/g, '/').replace('public/', '')}`,
                }));

                setImages(adjustedImages);
            } catch (error) {
                console.error('Error fetching movie images:', error);
            }
        };
        fetchImages();
    }, []);

    const openMovieImageOverlay = async (image)=>{
        setSelectedImage(image);
        try{
            const response = await fetch(`http://localhost:3000/auth/getMovieDetails/${image._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch series details');
            }
            const movieData = await response.json();
            setMovieData(movieData);

        }catch (error) {
            console.error('Error fetching movie details:', error);
        }
        setMovieImageOverlayOpen(true);
    } 

    const handleVideoEnded = () => {
        setIsPlaying(false);
    };

    const closeImageOverlay = () => {
        setSelectedImage(null);
        setMovieImageOverlayOpen(false);
        setIsPlaying(false);
    };

    return (
        <div className='relative'>
            <div className='relative  text-white font-bold text-2xl px-12 py-2 -top-20'>Watch Movies</div>
            <div className="relative container mx-auto pb-8 bg-black px-12 -top-20">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {images.map((image, index) => (
                        <div key={index} className="rounded-lg cursor-pointer overflow-hidden rounded-lg" 
                            onClick={() => openMovieImageOverlay(image)}>
                            <img
                                className="w-56 h-full rounded-lg object-cover transition-all duration-300 hover:scale-110"
                                src={image.imageUrl}
                                alt={`${image.seriesName} Poster`}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* when clicked on movie image*/}
            {selectedImage && isMovieImageOverlayOpen && (
                <div className="fixed top-0 left-0 bg-black w-screen h-screen bg-opacity-85 flex justify-center items-center" onClick={closeImageOverlay}>
                <div className='h-full w-1/2 bg-stone-900 overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                    {movieData?.trailerVideo && (
                        <div className="relative w-full h-96">
                            <video
                                // ref={trailerVideoRef}
                                src={`http://localhost:3000/${movieData.trailerVideo.replace(/\\/g, '/').replace('public/', '')}`}
                                poster={movieData.trailerVideoPoster ? `http://localhost:3000/${movieData.trailerVideoPoster.replace(/\\/g, '/').replace('public/', '')}` : ''}
                                className="w-full h-full object-cover"
                                onEnded={handleVideoEnded}
                            />
                            {!isPlaying && (
                                <div className="absolute inset-0 flex justify-center items-center text-white" 
                                // onClick={handleTrailerVideoPlayClick}
                                >
                                    <div className="group">
                                        <FaPlay className="relative top-16 left-8 text-4xl transition-colors duration-300 ease-in-out group-hover:text-red-700" />
                                        <PiCircleDuotone className="text-8xl transform transition-transform duration-700 ease-in-out group-hover:scale-110" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="m-8 p-4 text-white">
                        <RxCross2 className='text-3xl fixed top-5 right-1/4 mr-9 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-150' 
                        onClick={closeImageOverlay} />

                        <h2 className="text-3xl font-bold">{movieData.movieName}</h2>
                        {movieData ? (
                            <>
                                <p className="mt-2 text-zinc-400">{movieData.movieDetails}</p>
                                <p className="mt-2 text-zinc-400">Cast: {movieData.movieCast}</p>
                                <p className="mt-2 text-zinc-400">Creators: {movieData.movieCreators}</p>

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
                            </>
                        ) : (
                            <p className="mt-2 text-zinc-400">Loading series details...</p>
                        )}
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default Movies;
