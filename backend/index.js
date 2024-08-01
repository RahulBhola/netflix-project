const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config(); 
const cors = require("cors");
const seriesRoutes = require('./routes/auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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


// Routes
app.use('/auth', seriesRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
