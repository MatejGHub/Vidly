const express = require("express");
const genresRouter = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

// Connecting to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Vidly")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Creating a genre Schema
const genreSchema = new mongoose.Schema({
  name: String
});

// Creating a genre model
const Genre = mongoose.model("Genre", genreSchema);

// Fetching all genres
genresRouter.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.send(genres);
  } catch (err) {
    console.log(err.message);
  }
});

// Posting a genre
genresRouter.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  let genre = new Genre({ name: req.body.name }).save();

  try {
    genre = await genre.save();
    res.send(genre);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Displaying a genre by ID
genresRouter.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) {
      res.send("The genre with the given ID was not found");
      return;
    }
    res.send(genre);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Updating a genre
genresRouter.put("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre with the given ID was not found");
    return;
  }
  const schema = Joi.object({
    genre: Joi.string().min(3).max(20).required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  genre.name = req.body.genre;
  res.send(genre);
});

genresRouter.delete("/:id", (req, res) => {
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre with the given ID was not found");
    return;
  }
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

module.exports = genresRouter;
