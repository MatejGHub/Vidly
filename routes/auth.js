const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { Register } = require("./register");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Connecting to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Vidly")
  .then(() => {
    console.log("Connected to MongoDB auth");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(user);
}

authRouter.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Register.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = jwt.sign(
    {
      _id: user._id
    },
    process.env.jwtPrivateKey
  );

  res.send(token);
});

module.exports = { authRouter };
