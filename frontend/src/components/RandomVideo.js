import React, { useState, useEffect } from 'react';
import { FaPlay } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";


const RandomVideo = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/getAllSeries');
        const data = await response.json();

        // Fetch all series details to get trailerVideo, trailerVideoPoster, seriesName, and seriesDetails
        const seriesDetailsPromises = data.map(series =>
          fetch(`http://localhost:3000/auth/getSeriesDetails/${series._id}`)
            .then(res => res.json())
        );
        const seriesDetails = await Promise.all(seriesDetailsPromises);

        const trailerVideos = seriesDetails.map(series => ({
          url: series.trailerVideo ? `http://localhost:3000/${series.trailerVideo.replace(/\\/g, '/').replace('public/', '')}` : '',
          poster: series.trailerVideoPoster ? `http://localhost:3000/${series.trailerVideoPoster.replace(/\\/g, '/').replace('public/', '')}` : '',
          name: series.seriesName,
          details: series.seriesDetails,
        })).filter(video => video.url); // Filter out entries with no trailerVideo

        setVideos(trailerVideos);
      } catch (error) {
        console.error('Error fetching trailer videos:', error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    let posterTimer;
    let videoTimer;

    const handleVideoTransition = () => {
      setShowPoster(true);

      posterTimer = setTimeout(() => {
        setShowPoster(false);
        videoTimer = setTimeout(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % videos.length);
          setShowPoster(true);
        }, 300000); // 5 minutes in milliseconds
      }, 20000); // 20 seconds in milliseconds
    };

    handleVideoTransition();

    return () => {
      clearTimeout(posterTimer);
      clearTimeout(videoTimer);
    };
  }, [videos, currentIndex]);

  const handleVideoEnd = () => {
    setShowPoster(true);
    setTimeout(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % videos.length);
      setShowPoster(true);
    }, 20000); // 20 seconds in milliseconds
  };

  if (videos.length === 0) {
    return <div>Loading...</div>;
  }

  const { url, poster, name, details } = videos[currentIndex];

  return (
    <div className="relative w-full h-[80vh] flex justify-center items-center cursor-default">
      {showPoster ? (
        <div className="w-full h-full">
          <img src={poster} alt="Video Poster" className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60">
            <h1 className="text-7xl pl-12 pt-24 text-white uppercase font-bold font-hTitle">{name}</h1>
            <div className='flex space-x-8'>
              <div className="flex space-x-2 items-center text-black font-bold mt-52 bg-white p-2 ml-12 rounded-lg cursor-pointer text-xl px-6 font-hBody">
                <FaPlay />
                <p>Play</p>
              </div>
              <div className="flex space-x-2 items-center text-black font-bold mt-52 bg-white p-2 rounded-lg cursor-pointer text-xl px-6 font-hBody">
                <FaInfoCircle/>
                <p>More Info</p>
              </div>
            </div>
            <p className="text-zinc-300 mt-4 w-1/2 text-xl pl-12 font-hBody">{details}</p>
          </div>
        </div>
      ) : (
        <>
        <video 
          src={url} 
          poster={poster} 
          autoPlay 
          onEnded={handleVideoEnd}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 flex flex-col">
          <h1 className="text-7xl pl-12 pt-24 text-white uppercase font-bold font-hTitle">{name}</h1>
        </div>
        </>
      )}
    </div>
  );
};

export default RandomVideo;
