const express = require("express");
const app = express();
const Joi = require("joi"); // Validating the input

//Fetching ROUTES
const home = require("./routes/home"); // Fetches the home route
const { genresRouter } = require("./routes/genres"); // Fetches the genres route
const { rentalRouter } = require("./routes/rentals"); // Fetches the rentals route
const { customersRouter } = require("./routes/customers"); // Fetches the customers route
const { moviesRouter } = require("./routes/movies"); // Fetches the movies route
const { registerRouter } = require("./routes/register"); // Fetches the users route

//Middleware
app.use(express.json());
app.use("/", home);
app.use("/api/genres", genresRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/customers", customersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/users", registerRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
