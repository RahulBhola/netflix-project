const mongoose = require('mongoose');

// Define the Episode schema
const episodeSchema = new mongoose.Schema({
  episodeName: { type: String, required: true },
  posterPicture: { type: String, required: true},
  episodeVideo: { type: String, required: true },
  videoDetails: { type: String, required: true },
});

// Define the Season schema
const seasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number },
  episodes: { type: [episodeSchema], default: [] }, // Array of Episode schema
});

// Define the Series schema
const seriesSchema = new mongoose.Schema({
  seriesName: { type: String },
  seriesDetails:{ type: String },
  seriesCast:{ type: String },
  seriesCreators:{ type: String },

  picture: { type: String },
  trailerVideo: { type: String },
  trailerVideoPoster: { type: String },
  seasons: { type: [seasonSchema], default: [] }, // Array of Season schema
});

// Create the Series model
const Series = mongoose.model('Series', seriesSchema);

module.exports = Series;
