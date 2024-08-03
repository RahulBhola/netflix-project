const express = require('express');
const mongoose = require('mongoose');
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config(); // to hide password
const passport = require("passport");

const cors = require("cors");
const seriesRoutes = require('./routes/auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const User = require("./models/users");


app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.
    connect(
        "mongodb+srv://rahulbhola:" +
        process.env.MONGO_PASSWORD +
        "@cluster0.ov0t8jx.mongodb.net/", 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
.then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });


  // set passport-jwt6
let opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.identifier }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.identifier);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);


// Routes
app.use('/auth', seriesRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
