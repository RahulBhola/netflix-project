const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
    type: { type: String, enum: ['movie', 'series'], required: true },
    name: String,
    details: String,
    cast: String,
    creators: String,
    picture: String,
    trailerVideo: String,
    trailerVideoPoster: String,
    // Series specific fields
    seasons: [{
        seasonNumber: Number,
        episodes: [{
            episodeName: String,
            episodeVideo: String,
            videoDetails: String
        }]
    }],
});

module.exports = mongoose.model('ListItem', listItemSchema);
