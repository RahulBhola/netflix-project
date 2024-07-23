import React,{useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

const Movie = () => {
  const navigate = useNavigate();
 
  const [movieName, setMovieName] = useState("");
  const [movieDetails, setMovieDetails] = useState("");
  const [movieCast, setMovieCast] = useState("");
  const [movieCreators, setMovieCreators] = useState("");
  
  const [picture, setPicture] = useState(null);
  const [movieVideoPoster, setMovieVideoPoster] = useState(null);
  const [movieVideo, setMovieVideo] = useState(null);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };

  const handleTrailerVideoChange = (e) => {
    const file = e.target.files[0];
    setMovieVideo(file);
  };

  const handleTrailerVideoPosterChange = (e) => {
    const file = e.target.files[0];
    setMovieVideoPoster(file);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("movieName", movieName);
      formData.append("movieDetails", movieDetails);
      formData.append("movieCast", movieCast);
      formData.append("movieCreators", movieCreators);

      formData.append("picture", picture);
      formData.append("movieVideo", movieVideo);
      formData.append("movieVideoPoster", movieVideoPoster);

      const response = await fetch("http://localhost:3000/auth/movie", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save data.");
      }

      setMovieName("");
      setMovieDetails("");
      setMovieCast("");
      setMovieCreators("");

      setPicture(null);
      setMovieVideo(null);

      navigate("/home");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="p-12 w-full h-screen bg-gray-100">
      <form className="bg-white p-8 rounded shadow-md w-full h-full overflow-y-auto">
      <h1 className="text-3xl font-bold mb-12 text-center">Add New Movie</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Movie Name */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="movieName">
            Movie Name:
          </label>
          <input
            id="movieName"
            type="text"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter movie name"
            required
          />
        </div>

        {/* Movie Details */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="movieDetails">
            Movie Details:
          </label>
          <input
            id="movieDetails"
            type="text"
            value={movieDetails}
            onChange={(e) => setMovieDetails(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter movie details"
            required
          />
        </div>

        {/* Movie Cast */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="movieCast">
            Movie Cast:
          </label>
          <input
            id="movieCast"
            type="text"
            value={movieCast}
            onChange={(e) => setMovieCast(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter movie cast"
            required
          />
        </div>

        {/* Movie Creators */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="movieCreators">
            Movie Creators:
          </label>
          <input
            id="movieCreators"
            type="text"
            value={movieCreators}
            onChange={(e) => setMovieCreators(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter movie creators"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Movie Title Picture */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Movie Title Picture:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Movie Video */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Movie Video:
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleTrailerVideoChange}
            className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Movie Video Poster*/}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Movie Video Poster:
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
  )
}

export default Movie
