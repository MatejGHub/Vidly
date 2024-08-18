const express = require("express");
const moviesRouter = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

const { genreSchema, Genre } = require("./genres");

mongoose
  .connect("mongodb://127.0.0.1:27017/Vidly")
  .then(() => {
    console.log("Connected to mongoDB movies");
  })
  .catch((err) => {
    console.log("Error connecting to mongODB movies", err);
  });

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  }
});

const Movie = mongoose.model("Movie", movieSchema);

async function createMovie(title, grenreId, numberInStock, dailyRentalRate) {
  const genre = await Genre.findById(grenreId);
  if (!genre) return res.status(400).send("Invalid genre");
  let movie = new Movie({
    title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock,
    dailyRentalRate
  });

  movie = await movie.save();
}

moviesRouter.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

// createMovie("It ends with us", "66bb6e40f3a394b7de2a2f6b", 5, 4);

module.exports = { moviesRouter, movieSchema, Movie };
