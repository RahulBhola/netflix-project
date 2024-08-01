import React, { useState, useEffect } from 'react';
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const NewSeason = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(""); // State to track the selected series
  const [seasonNumber, setSeasonNumber] = useState(1); // Default to season 1
  const [episodes, setEpisodes] = useState([
    { episodeName: "", posterPicture: null, episodeVideo: null, videoDetails: "" },
  ]);

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
    }
  };

  const handleEpisodeChange = (index, field, value) => {
    const newEpisodes = [...episodes];
    newEpisodes[index][field] = value;
    setEpisodes(newEpisodes);
  };

  const handlePosterChange = (index, e) => {
    const file = e.target.files[0];
    const newEpisodes = [...episodes];
    newEpisodes[index].posterPicture = file;
    setEpisodes(newEpisodes);
  };

  const handleEpisodeVideoChange = (index, e) => {
    const file = e.target.files[0];
    const newEpisodes = [...episodes];
    newEpisodes[index].episodeVideo = file;
    setEpisodes(newEpisodes);
  };

  const addEpisode = () => {
    setEpisodes([...episodes, { episodeName: "", posterPicture: null, episodeVideo: null, videoDetails: "" }]);
  };

  const handleRemoveEpisode = (index) => {
    const newEpisodes = episodes.filter((_, i) => i !== index);
    setEpisodes(newEpisodes);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("seriesName", selectedSeries); // Include selected series name
      formData.append("seasonNumber", seasonNumber);

      episodes.forEach((episode, index) => {
        formData.append(`episodes[${index}][episodeName]`, episode.episodeName);
        formData.append(`episodes[${index}][posterPicture]`, episode.posterPicture);
        formData.append(`episodes[${index}][episodeVideo]`, episode.episodeVideo);
        formData.append(`episodes[${index}][videoDetails]`, episode.videoDetails);
      });

      const response = await fetch("http://localhost:3000/auth/addSeason", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save data.");
      }
      setEpisodes([{ episodeName: "", posterPicture: null, episodeVideo: null, videoDetails: "" }]);

      navigate("/home");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className='p-12 h-screen bg-gray-100 overflow-y-auto'>
      <div className="mx-auto mt-8 p-6 bg-white shadow-md rounded-md"> 
        <h1 className="text-3xl font-bold mb-4 text-center">Add New Season</h1>

        {/** select series */}
        <div className="mb-4">
          <label htmlFor="series" className="block text-sm font-medium text-gray-700">
            Select Series:
          </label>
          <select
            id="series"
            name="series"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedSeries} // Bind to selectedSeries state
            onChange={(e) => setSelectedSeries(e.target.value)} // Update state on change
          >
            <option value="">Select a series</option>
            {series.map((series) => (
              <option key={series._id} value={series.seriesName}>
                {series.seriesName}
              </option>
            ))}
          </select>
        </div>

        {/* Season No. */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Season Number:
          </label>
          <input
            type="number"
            value={seasonNumber}
            onChange={(e) => setSeasonNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter season number"
            required
          />
        </div>

        {/* Episodes */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Episodes:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {episodes.map((episode, index) => (
              <div key={index} className="relative border rounded-3xl p-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Episode {index + 1} Name:
                </label>
                <input
                  type="text"
                  value={episode.episodeName}
                  onChange={(e) => handleEpisodeChange(index, "episodeName", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={`Enter episode ${index + 1} name`}
                  required
                />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                  Episode {index + 1} Poster Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePosterChange(index, e)}
                  className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                  Episode {index + 1} Video:
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleEpisodeVideoChange(index, e)}
                  className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
                  Episode {index + 1} Details:
                </label>
                <textarea
                  value={episode.videoDetails}
                  onChange={(e) => handleEpisodeChange(index, "videoDetails", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={`Enter details for episode ${index + 1}`}
                  required
                />

                {/* Remove Episode Button */}
                <RxCross2
                  className="absolute top-4 right-4 font-bold text-gray-400 text-xl cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-150"
                  onClick={() => handleRemoveEpisode(index)}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addEpisode}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Episode
          </button>
        </div>

        {/* Cancel and Save button */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default NewSeason;
