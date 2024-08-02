const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Series = require('../models/Series'); 
const Movies = require('../models/Movies');
const ListItem = require('../models/ListItems');
const ListItems = require('../models/ListItems');
const User = require("../models/User");

const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helper");
const passport = require("passport");


// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseDir = "public";
    const videoDir = path.join(baseDir, 'videos');
    const imageDir = path.join(baseDir, 'images');

    // Ensure directories exist
    if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir);
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      cb(null, imageDir);
    } else if (ext === '.mkv' || ext === '.mp4') {
      cb(null, videoDir);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mkv' && ext !== '.mp4') {
    return cb(new Error("Only image and video files are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST endpoint to save series and episodes data
router.post('/series', upload.any(), async (req, res) => {
  try {
    const { seriesName, seriesDetails, seriesCast, seriesCreators, seasonNumber, episodes } = req.body;

    const picture = req.files.find(file => file.fieldname === 'picture')?.path;
    const trailerVideo = req.files.find(file => file.fieldname === 'trailerVideo')?.path;
    const trailerVideoPoster = req.files.find(file => file.fieldname === 'trailerVideoPoster')?.path;

    const episodeData = episodes.map((episode, index) => ({
      episodeName: episode.episodeName,
      posterPicture: req.files.find(file => file.fieldname === `episodes[${index}][posterPicture]`)?.path,
      episodeVideo: req.files.find(file => file.fieldname === `episodes[${index}][episodeVideo]`)?.path,
      videoDetails: episode.videoDetails,
    }));

    const newSeries = new Series({
      seriesName,
      seriesDetails,
      seriesCast,
      seriesCreators,
      picture,
      trailerVideo,
      trailerVideoPoster,
      seasons: [{ seasonNumber, episodes: episodeData }],
    });

    await newSeries.save();

    res.status(201).send('Series and episodes saved successfully.');
  } catch (error) {
    console.error('Error saving series and episodes:', error);
    res.status(500).send('Error saving series and episodes.');
  }
});

// POST endpoint to save movies data
router.post('/movie', upload.any(), async (req, res) => {
  try {
    const { movieName, movieDetails, movieCast, movieCreators } = req.body;

    const picture = req.files.find(file => file.fieldname === 'picture')?.path;
    const movieVideo = req.files.find(file => file.fieldname === 'movieVideo')?.path;
    const movieVideoPoster = req.files.find(file => file.fieldname === 'movieVideoPoster')?.path;

    const newMovie = new Movies({
      movieName,
      movieDetails,
      movieCast,
      movieCreators,
      picture,
      movieVideo,
      movieVideoPoster
    });

    await newMovie.save();

    res.status(201).send('movie data is saved successfully.');
  } catch (error) {
    console.error('Error saving movie data:', error);
    res.status(500).send('Error saving movie data.');
  }
});

// Endpoint to fetch all series
router.get('/getAllSeries', async (req, res) => {
  try {
    const series = await Series.find({}, 'seriesName'); // Fetch only seriesName for dropdown
    res.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({ error: 'Failed to fetch series' });
  }
});

// Endpoint to fetch seasons by seriesName
router.get('/getSeasons/:seriesName', async (req, res) => {
  try {
    const { seriesName } = req.params;
    const series = await Series.findOne({ seriesName });
    if (!series) {
      return res.status(404).json({ error: 'Series not found' });
    }
    const seasons = series.seasons.map(season => ({
      seasonNumber: season.seasonNumber,
      _id: season._id
    }));
    res.json(seasons);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ error: 'Failed to fetch seasons' });
  }
});

// Endpoint to fetch episodes by season ID
router.get('/getEpisodes/:seasonId', async (req, res) => {
  const seasonId = req.params.seasonId;

  try {
    const series = await Series.findOne({ 'seasons._id': seasonId });
    if (!series) {
      return res.status(404).json({ error: 'Series not found' });
    }

    const season = series.seasons.id(seasonId);
    if (!season) {
      return res.status(404).json({ error: 'Season not found' });
    }

    // Map episodes to format video paths correctly
    const episodesWithUrls = season.episodes.map(episode => ({
      _id: episode._id,
      episodeName: episode.episodeName,
      posterPicture: episode.posterPicture ? `http://localhost:3000/${episode.posterPicture.replace(/\\/g, '/').replace('public/', '')}`: null,
      episodeVideo: episode.episodeVideo ? `http://localhost:3000/${episode.episodeVideo.replace(/\\/g, '/').replace('public/', '')}` : null,
      videoDetails: episode.videoDetails,
    }));

    res.json(episodesWithUrls);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    res.status(500).json({ error: 'Failed to fetch episodes' });
  }
});

// Endpoint to fetch all images
router.get('/getAllImages', async (req, res) => {
  try {
    const seriesList = await Series.find({}, 'picture'); // Fetch picture fields

    const images = seriesList.map(series => ({
      _id: series._id,
      imageUrl: series.picture ? `http://localhost:3000/${series.picture.replace(/\\/g, '/').replace('public/', '')}` : null,
    })).filter(image => image.imageUrl); // Filter out null imageUrl entries
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Endpoint to fetch all movie images
router.get('/getAllMovieImages', async (req, res) => {
  try {
    const movieList = await Movies.find({}, 'picture'); // Fetch picture fields

    const images = movieList.map(movie => ({
      _id: movie._id,
      imageUrl: movie.picture ? `http://localhost:3000/${movie.picture.replace(/\\/g, '/').replace('public/', '')}` : null,
    })).filter(image => image.imageUrl); // Filter out null imageUrl entries
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Endpoint to fetch series details by ID
router.get('/getSeriesDetails/:id', async (req, res) => {
  try {
      const seriesId = req.params.id;
      const series = await Series.findById(seriesId);

      if (!series) {
          return res.status(404).json({ error: 'Series not found' });
      }
      res.json(series);
  } catch (error) {
      console.error('Error fetching series details:', error);
      res.status(500).json({ error: 'Failed to fetch series details' });
  }
});

// Endpoint to fetch series details by ID
router.get('/getMovieDetails/:id', async (req, res) => {
  try {
      const movieId = req.params.id;
      const movie = await Movies.findById(movieId);

      if (!movie) {
          return res.status(404).json({ error: 'movie not found' });
      }
      res.json(movie);
  } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Endpoint to add a new episode
router.post('/addEpisode', upload.single('episodeVideo'), async (req, res) => {
  try {
    const { seriesName, seasonId, episodeName, videoDetails } = req.body;
    const episodeVideo = req.file ? req.file.path : null;

    const series = await Series.findOne({ seriesName });
    if (!series) {
      return res.status(404).json({ error: 'Series not found' });
    }

    const season = series.seasons.id(seasonId);
    if (!season) {
      return res.status(404).json({ error: 'Season not found' });
    }

    const newEpisode = {
      episodeName,
      episodeVideo,
      videoDetails,
    };

    season.episodes.push(newEpisode);
    await series.save();

    res.status(201).json({ message: 'Episode added successfully' });
  } catch (error) {
    console.error('Error adding episode:', error);
    res.status(500).json({ error: 'Failed to add episode' });
  }
});

// Add Season endpoint
router.post('/addSeason', upload.any(), async (req, res) => {
  try {
    const { seriesName, seasonNumber, episodes } = req.body;

    const series = await Series.findOne({ seriesName });

    if (!series) {
      return res.status(404).json({ message: 'Series not found.' });
    }

    // Check if seasonNumber already exists for the series
    const existingSeason = series.seasons.find(season => season.seasonNumber === parseInt(seasonNumber, 10));
    if (existingSeason) {
      return res.status(400).json({ message: `Season ${seasonNumber} already exists for ${seriesName}.` });
    }

    const newSeason = {
      seasonNumber: parseInt(seasonNumber, 10),
      episodes: episodes.map((ep, index) => ({
        episodeName: ep.episodeName,
        posterPicture: req.files.find(file => file.fieldname === `episodes[${index}][posterPicture]`)?.path,
        episodeVideo: req.files.find(file => file.fieldname === `episodes[${index}][episodeVideo]`).path,
        videoDetails: ep.videoDetails,
      })),
    };

    series.seasons.push(newSeason);
    await series.save();

    res.status(200).json({ message: 'Season added successfully.' });
  } catch (error) {
    console.error('Error adding season:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/addToList', async (req, res) => {
  try {
      const listItem = new ListItem(req.body);
      await listItem.save();
      res.status(201).json(listItem);
  } catch (error) {
      console.error('Error adding to list:', error);
      res.status(500).json({ error: 'Failed to add to list' });
  }
});

router.get('/getListItems', async (req, res) => {
  try {
      const listItems = await ListItem.find({});
      res.status(200).json(listItems);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch list items', error });
  }
});

// Endpoint to fetch series details by ID
router.get('/getMovieListItem/:id', async (req, res) => {
  try {
      const movieId = req.params.id;
      const movie = await ListItems.findById(movieId);

      if (!movie) {
          return res.status(404).json({ error: 'movie not found' });
      }
      res.json(movie);
  } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Endpoint to fetch series details by ID
router.get('/getListItemSeriesDetails/:id', async (req, res) => {
  try {
      const seriesId = req.params.id;
      const series = await ListItem.findById(seriesId);

      if (!series) {
          return res.status(404).json({ error: 'Series not found' });
      }
      res.json(series);
  } catch (error) {
      console.error('Error fetching series details:', error);
      res.status(500).json({ error: 'Failed to fetch series details' });
  }
});

// Endpoint to fetch episodes by season ID
router.get('/getEpisodesListItem/:seasonId', async (req, res) => {
  const seasonId = req.params.seasonId;

  try {
    const series = await ListItem.findOne({ 'seasons._id': seasonId });
    if (!series) {
      return res.status(404).json({ error: 'Series not found' });
    }

    const season = series.seasons.id(seasonId);
    if (!season) {
      return res.status(404).json({ error: 'Season not found' });
    }

    // Map episodes to format video paths correctly
    const episodesWithUrls = season.episodes.map(episode => ({
      _id: episode._id,
      episodeName: episode.episodeName,
      posterPicture: episode.posterPicture ? `http://localhost:3000/${episode.posterPicture.replace(/\\/g, '/').replace('public/', '')}`: null,
      episodeVideo: episode.episodeVideo ? `http://localhost:3000/${episode.episodeVideo.replace(/\\/g, '/').replace('public/', '')}` : null,
      videoDetails: episode.videoDetails,
    }));

    res.json(episodesWithUrls);
  } catch (error) {
    console.error('Error fetching episodes:', error);
    res.status(500).json({ error: 'Failed to fetch episodes' });
  }
});

// backend/routes/listItems.js

router.delete('/deleteListItem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ListItem.findByIdAndDelete(id);
    res.status(200).json({ message: 'List item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete list item', error });
  }
});

// This POST route will help to register a user
router.post("/register", async (req, res) => {
  // This code is run when the /register api is called as a POST request

  // My req.body will be of the format {email, password, firstName, lastName, username }
  const { email, password, username } = req.body;

  // Step 2 : Does a user with this email already exist? If yes, we throw an error.
  const user = await User.findOne({ email: email });
  if (user) {
    // status code by default is 200(success)
    return res.status(403).json({
      // _id: user._id,
      error: "A user with this email already exists",
    });
  }
  // This is a valid request

  // Step 3: Create a new user in the DB
  // Step 3.1 : We do not store passwords in plain text.
  // xyz: we convert the plain text password to a hash.
  // xyz --> asghajskbvjacnijhabigbr
  // My hash of xyz depends on 2 parameters.
  // If I keep those 2 parameters same, xyz ALWAYS gives the same hash.
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserData = {
    email,
    password: hashedPassword,
    username,
  };
  const newUser = await User.create(newUserData);
  console.log(newUserData);

  // Step 4: We want to create the token to return to the user
  const token = await getToken(email, newUser);

  // Step 5: Return the result to the user
  const userToReturn = { ...newUser.toJSON(), token };
  console.log(userToReturn);
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
  // Step 1: Get email and password sent by user from req.body
  const { email, password } = req.body;

  // Step 2: Check if a user with the given email exists. If not, the credentials are invalid.
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  console.log(user);

  // Step 3: If the user exists, check if the password is correct. If not, the credentials are invalid.
  // This is a tricky step. Why? Because we have stored the original password in a hashed form, which we cannot use to get back the password.
  // I cannot do : if(password === user.password)
  // bcrypt.compare enabled us to compare 1 password in plaintext(password from req.body) to a hashed password(the one in our db) securely.
  const isPasswordValid = await bcrypt.compare(password, user.password);
  // This will be true or false.
  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  // Step 4: If the credentials are correct, return a token to the user.
  const token = await getToken(user.email, user);
  const userToReturn = { ...user.toJSON(), token };
  delete userToReturn.password;
  return res.status(200).json(userToReturn);
});

module.exports = router;
