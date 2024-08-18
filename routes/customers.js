const express = require("express");
const customersRouter = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

// Connecting to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/Vidly")
  .then(() => {
    console.log("Connected to MongoDB customers");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isGold: { type: Boolean, default: false },
  phone: { type: String, minlength: 3, maxlength: 12 }
});

// Customer Model
const Customers = mongoose.model("Customer", customerSchema);

// Fetching all customers
customersRouter.get("/", async (req, res) => {
  try {
    const customers = await Customers.find();
    res.send(customers);
  } catch (err) {
    console.log(err.message);
  }
});

// Posting a customer
customersRouter.post("/", async (req, res) => {
  try {
    const customer = new Customers({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone
    });

    const result = await customer.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Displaying a customer by ID
customersRouter.get("/:id", async (req, res) => {
  try {
    const customer = await Customers.findById(req.params.id);
    if (!customer) {
      res.send("The customer with the given ID was not found");
      return;
    }
    res.send(customer);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Updating a customer
customersRouter.put("/:id", async (req, res) => {
  try {
    const customer = await Customers.findByIdAndUpdate(
      req.params.id,
      { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
      { new: true, runValidators: true }
    );

    if (!customer) {
      res.send("The genre with the given ID was not found");
      return;
    }
    res.send(customer);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Deleting a customer
customersRouter.delete("/:id", async (req, res) => {
  try {
    const customer = await Customers.findByIdAndDelete(req.params.id);
    if (!customer) {
      res.send("The customer with the given ID was not found");
      return;
    }
    res.send(customer);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { customersRouter, Customers, customerSchema };
