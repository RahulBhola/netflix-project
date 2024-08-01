import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import OpenListMovieImageOverlay from '../services/OpenListMovieImageOverlay';
import OpenListImageOverlay from '../services/OpenListImageOverlay';

const List = () => {
  const [listItems, setListItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageOverlayOpen, setImageOverlayOpen] = useState(false);
  const [isMovieImageOverlayOpen, setMovieImageOverlayOpen] = useState(false);
  const [seriesData, setSeriesData] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchListItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/getListItems');
        if (!response.ok) {
          throw new Error('Failed to fetch list items');
        }
        const data = await response.json();
        setListItems(data);
      } catch (error) {
        console.error('Error fetching list items:', error);
      }
    };

    fetchListItems();
  }, []);

  const openOverlay = async (item) => {
    setSelectedImage(item);

    if (item.type === 'series') {
      try {
        const response = await fetch(`http://localhost:3000/auth/getListItemSeriesDetails/${item._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch series details');
        }
        const data = await response.json();
        setSeriesData(data);
        setSeasons(data.seasons);
        setSelectedSeason(data.seasons[0]); // Set default season
        const episodesResponse = await fetch(`http://localhost:3000/auth/getEpisodesListItem/${data.seasons[0]._id}`);
        if (!episodesResponse.ok) {
          throw new Error('Failed to fetch episodes');
        }
        const episodesData = await episodesResponse.json();
        setEpisodes(episodesData);
      } catch (error) {
        console.error('Error fetching series details:', error);
      }
      setImageOverlayOpen(true);
    } else if (item.type === 'movie') {
      try {
        const response = await fetch(`http://localhost:3000/auth/getMovieListItem/${item._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
      setMovieImageOverlayOpen(true);
    }
  };

  const closeImageOverlay = () => {
    setSelectedImage(null);
    setImageOverlayOpen(false);
    setMovieImageOverlayOpen(false);
    setSeriesData(null);
    setSeasons([]);
    setEpisodes([]);
    setSelectedSeason(null);
  };

  // Determine container height based on number of items
  const containerHeight = listItems.length > 6 ? 'h-full' : 'h-screen';

  return (
    <div className={`w-full ${containerHeight} bg-black`}>
      <Header />
      <p className='mx-16 text-3xl text-white'>My List</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mx-16 mt-6'>
        {listItems.map((item) => (
          <div
            key={item._id}
            className="rounded-lg cursor-pointer overflow-hidden"
            onClick={() => openOverlay(item)}
          >
            <img
              className="w-56 h-full rounded-lg object-cover transition-all duration-300 hover:scale-110"
              src={item.picture}
              alt={item.name || 'Image'}
            />
          </div>
        ))}
      </div>
      {selectedImage && isMovieImageOverlayOpen && (
        <OpenListMovieImageOverlay
          isOpen={isMovieImageOverlayOpen}
          movieData={movieData}
          closeOverlay={closeImageOverlay}
          picture={selectedImage.picture}
        />
      )}
      {selectedImage && isImageOverlayOpen && (
        <OpenListImageOverlay
          isOpen={isImageOverlayOpen}
          seriesData={seriesData}
          closeOverlay={closeImageOverlay}
          picture={selectedImage.picture}
        />
      )}
    </div>
  );
};

export default List;
