import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const UpdateSeason = () => {
  const navigate = useNavigate();

  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [newEpisode, setNewEpisode] = useState({
    episodeName: '',
    episodeVideo: null,
    videoDetails: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/getAllSeries');
      if (!response.ok) {
        throw new Error('Failed to fetch series.');
      }

      let data = await response.json();
      data = data.sort((a, b) => a.seriesName.localeCompare(b.seriesName));
      setSeries(data);
      
    } catch (error) {
      console.error('Error fetching series:', error);
      // Handle error state or display message to user
    }
  };

  const handleSeriesChange = async (event) => {
    const selectedSeriesName = event.target.value;
    setSelectedSeries(selectedSeriesName);
    setSelectedSeason('');

    try {
      const response = await fetch(`http://localhost:3000/auth/getSeasons/${selectedSeriesName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch seasons.');
      }
      let data = await response.json();
      data = data.sort((a, b) => a.seasonNumber - b.seasonNumber);
      setSeasons(data);

    } catch (error) {
      console.error('Error fetching seasons:', error);
      // Handle error state or display message to user
    }
  };

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEpisode({ ...newEpisode, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    setNewEpisode({
      ...newEpisode,
      episodeVideo: file,
    });
  };

  const handleAddEpisode = async () => {
    if (!selectedSeries || !selectedSeason || !newEpisode.episodeName || !selectedFile) {
      setMessage("Please fill in all required fields.");
      return;
    }
  
    setIsLoading(true);
    setMessage('');
  
    try {
      const formData = new FormData();
      formData.append('seriesName', selectedSeries);
      formData.append('seasonId', selectedSeason);
      formData.append('episodeName', newEpisode.episodeName);
      formData.append('videoDetails', newEpisode.videoDetails);
      formData.append('episodeVideo', selectedFile);
  
      const response = await fetch('http://localhost:3000/auth/addEpisode', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to add episode.');
      }
  
      const result = await response.json();
      console.log('Episode added successfully:', result);
      setMessage('Episode added successfully!');
      navigate("/devpage");
  
      // Reset form fields after successful submission
      setNewEpisode({
        episodeName: '',
        episodeVideo: null,
        videoDetails: '',
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error adding episode:', error);
      setMessage('Failed to add episode.');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className='p-12 h-screen bg-gray-100'>
      <div className="mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Add New Episode</h1>
        {message && (
          <div className={`mb-4 p-2 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
        {/** select series */}
        <div className="mb-4">
          <label htmlFor="series" className="block text-sm font-medium text-gray-700">
            Select Series:
          </label>
          <select
            id="series"
            name="series"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleSeriesChange}
          >
            <option value="">Select a series</option>
            {series.map((series) => (
              <option key={series._id} value={series.seriesName}>
                {series.seriesName}
              </option>
            ))}
          </select>
        </div>

        {/** select season */}
        <div className="mb-4">
          <label htmlFor="season" className="block text-sm font-medium text-gray-700">
            Select Season:
          </label>
          <select
            id="season"
            name="season"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleSeasonChange}
            value={selectedSeason}
          >
            <option value="">Select a season</option>
            {seasons.map((season) => (
              <option key={season._id} value={season._id}>
                Season {season.seasonNumber}
              </option>
            ))}
          </select>
        </div>
        
        {/** episode name */}
        <div className="mb-4">
          <label htmlFor="episodeName" className="block text-sm font-medium text-gray-700">
            Episode Name:
          </label>
          <input
            type="text"
            id="episodeName"
            name="episodeName"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newEpisode.episodeName}
            onChange={handleInputChange}
          />
        </div>

        {/** episode video */}
        <div className="mb-4">
          <label htmlFor="episodeVideo" className="block text-sm font-medium text-gray-700">
            Episode Video (Upload):
          </label>
          <input
            type="file"
            id="episodeVideo"
            name="episodeVideo"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <p className="mt-2 text-xs text-gray-500">
              Selected File: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </p>
          )}
        </div>

        {/** video details */}
        <div className="mb-4">
          <label htmlFor="videoDetails" className="block text-sm font-medium text-gray-700">
            Video Details:
          </label>
          <textarea
            id="videoDetails"
            name="videoDetails"
            rows="3"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newEpisode.videoDetails}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/** button */}
        <button
          type="button"
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
            isLoading || !selectedSeason || !newEpisode.episodeName || !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleAddEpisode}
          disabled={isLoading || !selectedSeason || !newEpisode.episodeName || !selectedFile}
        >
          {isLoading ? 'Adding Episode...' : 'Add Episode'}
        </button>
      </div>
    </div>
  );
};

export default UpdateSeason;
