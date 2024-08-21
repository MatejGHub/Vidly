const express = require("express");
const registerRouter = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let saveUser;

// Connecting to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Vidly")
  .then(() => {
    console.log("Connected to MongoDB register");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Creating a user Schema
const register = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    kMaxLength: 20
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxLength: 1024
  }
});

// Creating a user model
const Register = mongoose.model("Register", register);

async function registerUser(name, email, password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = new Register({
      name: name,
      email: email,
      password: password
    });

    await user.save();
    console.log({
      name: user.name,
      email: user.email,
      password: hashedPassword
    });
  } catch (err) {
    console.log(err.message);
  }
}

// registerUser("Matthew Beem", "matthew.beem@gmail.com", "123123");

registerRouter.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  let registerUser = new Register({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    saveUser = await registerUser.save();
    res.send({
      name: saveUser.name,
      email: saveUser.email,
      password: hashedPassword
    });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = { registerRouter, Register };
