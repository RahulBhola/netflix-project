const mongoose = require ('mongoose');

// Define the Movies schema
const movieSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    movieDetails:{ type: String, required: true },
    movieCast:{ type: String },
    movieCreators:{ type: String },
  
    picture: { type: String, required: true},
    movieVideoPoster: { type: String, required: true },

    movieVideo: { type: String, required: true },
  });

const Movie = mongoose.model('Movies', movieSchema);

module.exports = Movie;
