import React, { useState, useEffect, useRef } from 'react';
import OpenMovieImageOverlay from '../services/OpenMovieImageOverlay';
import OpenImageOverlay from '../services/OpenImageOverlay';

const RecentlyAdded = () => {
    const [images, setImages] = useState([]);
    const [movieImages, setMovieImages] = useState([]);
    
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageOverlayOpen, setImageOverlayOpen] = useState(false);
    const [isMovieImageOverlayOpen, setMovieImageOverlayOpen] = useState(false);
    
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const [seriesData, setSeriesData] = useState(null); // State to hold series details
    const [movieData, setMovieData] = useState(null);

    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodes, setEpisodes] = useState([]);

    const videoRef = useRef(null); // Ref to reference the video element
    const dropdownRef = useRef(null); // Ref for the dropdown

    const [isPlaying, setIsPlaying] = useState(false);


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

        
        fetchImages();
    });

    useEffect(() => {
        const fetchMovieImages = async () => {
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

                setMovieImages(adjustedImages);
            } catch (error) {
                console.error('Error fetching movie images:', error);
            }
        };
        fetchMovieImages();
    }, []);
    

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

    const openMovieImageOverlay = async (image) => {
        setSelectedImage(image);
        try {
            const response = await fetch(`http://localhost:3000/auth/getMovieDetails/${image._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            const movieData = await response.json();
            setMovieData(movieData);

        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
        setMovieImageOverlayOpen(true);
    } 


    const closeImageOverlay = () => {
        setSelectedImage(null);
        setImageOverlayOpen(false);
        setMovieImageOverlayOpen(false);
        setSeriesData(null); // Clear series details when overlay is closed
        setSeasons([]);
        setEpisodes([]);
        setIsPlaying(false);
        setSelectedSeason(null); // Reset selected season to null
        setDropdownOpen(false);
    };

     
    return (
        <div className='relative'>
            <div className='relative  text-white font-bold text-2xl px-12 py-2 -top-20'>Recently Added</div>
            <div className="relative container mx-auto pb-8 px-12 -top-20">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {images.map((image, index) => (
                        <div key={index} className="rounded-lg cursor-pointer overflow-hidden rounded-lg" 
                            onClick={() => openImageOverlay(image)}>
                            <img
                                className="w-56 h-full rounded-lg object-cover transition-all duration-300 hover:scale-110"
                                src={image.imageUrl}
                                alt={`${image.seriesName} Poster`}
                            />
                        </div>
                    ))}
                    {movieImages.map((image, index) => (
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
                <OpenMovieImageOverlay  isOpen={isMovieImageOverlayOpen} movieData={movieData} closeOverlay={closeImageOverlay} picture={selectedImage.imageUrl} />
            )}

            {/* when clicked on season image*/}
            {selectedImage && isImageOverlayOpen && (
                <OpenImageOverlay  isOpen={isImageOverlayOpen} seriesData={seriesData} closeOverlay={closeImageOverlay} picture={selectedImage.imageUrl} />
            )}
        </div>
    )
}

export default RecentlyAdded
