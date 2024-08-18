const express = require("express");
const genresRouter = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

// Connecting to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Vidly")
  .then(() => {
    console.log("Connected to MongoDB genres");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Creating a genre Schema
const genreSchema = new mongoose.Schema({
  name: { type: String }
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
genresRouter.put("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );

    if (!genre) {
      res.send("The genre with the given ID was not found");
      return;
    }
    res.send(genre);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Deleting a genre
genresRouter.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      res.send("The genre with the given ID was not found");
      return;
    }
    res.send(genre);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { genresRouter, genreSchema, Genre };
