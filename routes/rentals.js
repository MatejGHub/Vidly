const express = require("express");
const rentalRouter = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");

const { customerSchema, Customers } = require("./customers");
const { movieSchema, Movie } = require("./movies");

mongoose
  .connect("mongodb://127.0.0.1:27017/Vidly")
  .then(() => {
    console.log("Connected to MongoDB rentals");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB rentals", err);
  });

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true
  },
  movie: {
    type: movieSchema,
    required: true
  },
  dateOut: {
    type: Date,
    required: true
  },
  dateDue: {
    type: Date,
    required: true
  }
});

const Rental = mongoose.model("rentals", rentalSchema);

async function createRental(customerId, movieId) {
  const customer = await Customers.findById(customerId);
  if (!customer) return res.status(400).send("Invalid Custoer");
  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).send("Invalid Movie");
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone
    },
    movie: {
      title: movie.title,
      genre: {
        _id: movie.genre._id,
        name: movie.genre.name
      },
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    },
    dateOut: Date.now(),
    dateDue: Date.now() + 21 * 24 * 60 * 60 * 1000
  });

  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
}

rentalRouter.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    res.send(rentals);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

rentalRouter.post("/", async (req, res) => {
  try {
    const rental = new Rental({
      customer: req.body.customer,
      movie: req.body.movie,
      dateOut: req.body.dateOut,
      dateDue: req.body.dateDue
    });

    const result = await rental.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// createRental("66bb8b48360f4b60d985618e", "66c0644a2561f16f0bec9c09");

module.exports = { rentalRouter };
