const express = require("express");
const app = express();
const Joi = require("joi"); // Validating the input

//Fetching ROUTES
const genres = require("./routes/genres"); // Fetches the genres route
const home = require("./routes/home"); // Fetches the home route

//Middleware
app.use(express.json());
app.use("/api/genres", genres);
app.use("/", home);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
