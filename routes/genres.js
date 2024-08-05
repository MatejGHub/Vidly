const express = require("express");
const genresRouter = express.Router();

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Horror" },
  { id: 3, name: "Comedy" },
  { id: 4, name: "Romance" },
  { id: 5, name: "Thriller" },
  { id: 6, name: "Drama" },
  { id: 7, name: "Sci-Fi" },
  { id: 8, name: "Fantasy" },
  { id: 9, name: "Mystery" },
  { id: 10, name: "Adventure" },
  { id: 11, name: "Crime" },
  { id: 12, name: "Animation" }
];

genresRouter.get("/", (req, res) => {
  res.send(genres);
});

genresRouter.post("/", (req, res) => {
  const schema = Joi.object({
    genre: Joi.string().min(3).max(20).required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const genre = {
    id: genres.length + 1,
    name: req.body.genre
  };
  genres.push(genre);
  res.send(genre);
});

genresRouter.get("/:id", (req, res) => {
  const genre = genres.find((g) => {
    return g.id === parseInt(req.params.id);
  });
  if (!genre) {
    res.status(404).send("The genre with the given ID was not found");
    return;
  }
  res.send(genre);
});

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
