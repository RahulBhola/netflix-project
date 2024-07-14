import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

function Series() {
  const navigate = useNavigate();

  const [seriesName, setSeriesName] = useState("");
  const [seriesDetails, setSeriesDetails] = useState("");
  const [seriesCast, setSeriesCast] = useState("");
  const [seriesCreators, setSeriesCreators] = useState("");
  
  const [picture, setPicture] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const [trailerVideoPoster, setTrailerVideoPoster] = useState(null);
  const [seasonNumber, setSeasonNumber] = useState(1); // Default to season 1

  const [episodes, setEpisodes] = useState([
    { episodeName: "", posterPicture: null, episodeVideo: null, videoDetails: "" },
  ]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };

  const handleTrailerVideoPosterChange = (e) => {
    const file = e.target.files[0];
    setTrailerVideoPoster(file);
  };

  const handlePosterChange = (index, e) => {
    const file = e.target.files[0];
    const newEpisodes = [...episodes];
    newEpisodes[index].posterPicture = file;
    setEpisodes(newEpisodes);
  };

  const handleTrailerVideoChange = (e) => {
    const file = e.target.files[0];
    setTrailerVideo(file);
  };

  const handleEpisodeChange = (index, field, value) => {
    const newEpisodes = [...episodes];
    newEpisodes[index][field] = value;
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
      formData.append("seriesName", seriesName);
      formData.append("seriesDetails", seriesDetails);
      formData.append("seriesCast", seriesCast);
      formData.append("seriesCreators", seriesCreators);

      formData.append("picture", picture);
      formData.append("trailerVideo", trailerVideo);
      formData.append("trailerVideoPoster", trailerVideoPoster);
      formData.append("seasonNumber", seasonNumber);

      episodes.forEach((episode, index) => {
        formData.append(`episodes[${index}][episodeName]`, episode.episodeName);
        formData.append(`episodes[${index}][posterPicture]`, episode.posterPicture);
        formData.append(`episodes[${index}][episodeVideo]`, episode.episodeVideo);
        formData.append(`episodes[${index}][videoDetails]`, episode.videoDetails);
      });

      const response = await fetch("http://localhost:3000/auth/series", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save data.");
      }

      setSeriesName("");
      setSeriesDetails("");
      setSeriesCast("");
      setSeriesCreators("");

      setPicture(null);
      setTrailerVideo(null);
      setEpisodes([{ episodeName: "", posterPicture: null, episodeVideo: null, videoDetails: "" }]);

      navigate("/home");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="p-12 w-full h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full h-full overflow-y-auto">
        <h1 className="text-3xl font-bold mb-12 text-center">Add New Series</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Series Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seriesName">
              Series Name:
            </label>
            <input
              id="seriesName"
              type="text"
              value={seriesName}
              onChange={(e) => setSeriesName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter series name"
              required
            />
          </div>

          {/* Series Details */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seriesDetails">
              Series Details:
            </label>
            <input
              id="seriesDetails"
              type="text"
              value={seriesDetails}
              onChange={(e) => setSeriesDetails(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter series details"
              required
            />
          </div>

          {/* Series Cast */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seriesCast">
              Series Cast:
            </label>
            <input
              id="seriesCast"
              type="text"
              value={seriesCast}
              onChange={(e) => setSeriesCast(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter series cast"
              required
            />
          </div>

          {/* Series Creators */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="seriesCreators">
              Series Creators:
            </label>
            <input
              id="seriesCreators"
              type="text"
              value={seriesCreators}
              onChange={(e) => setSeriesCreators(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter series creators"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Series Title Picture */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Series Title Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Trailer Video */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Trailer Video:
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleTrailerVideoChange}
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Trailer Video Poster*/}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Trailer Video Poster:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleTrailerVideoPosterChange}
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
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
      </form>
    </div>
  );
}

export default Series;
