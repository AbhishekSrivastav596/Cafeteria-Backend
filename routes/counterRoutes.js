const express = require('express');
const router = express.Router();
const Counter = require('../models/counter');
const User = require('../models/user');
const Dish = require('../models/dish');



router.post('/', async (req, res) => {
  try {
    const { name, merchants, imageUrl, description } = req.body;
    const newCounter = new Counter({ name, merchants, imageUrl, description });
    await newCounter.save();
    res.status(201).json({ message: "Counter created", counter: newCounter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create counter", error: err });
  }
});


router.get('/', async (req, res) => {
  try {
    const counters = await Counter.find().populate('merchants');
    res.status(200).json(counters);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch counters", error: err });
  }
});


router.get('/:counterId', async (req, res) => {
  try {
    const counter = await Counter.findById(req.params.counterId).populate('merchants');
    if (!counter) {
      return res.status(404).json({ message: "Counter not found" });
    }
    res.status(200).json({message:"Successfully fetched counter",counter});
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch counter", error: err });
  }
});



router.put('/:counterId', async (req, res) => {
  try {
    const { name, merchants, imageUrl, description } = req.body;
    const updatedCounter = await Counter.findByIdAndUpdate(
      req.params.counterId,
      { name, merchants, imageUrl, description},
      { new: true }
    ).populate('merchants');

    if (!updatedCounter) {
      return res.status(404).json({ message: "Counter not found" });
    }

    res.status(200).json({ message: "Counter updated", counter: updatedCounter });
  } catch (err) {
    res.status(500).json({ message: "Failed to update counter", error: err });
  }
});


router.put('/:counterId/merchant/:merchantId', async (req, res) => {
  try {
    const counter = await Counter.findById(req.params.counterId);
    const merchant = await User.findById(req.params.merchantId);

    if (!counter || !merchant) {
      return res.status(404).json({ message: "Counter or Merchant not found" });
    }

    if (!counter.merchants.includes(merchant._id)) {
      counter.merchants.push(merchant._id);
      await counter.save();
      res.status(200).json({ message: "Merchant added to counter", counter });
    } else {
      res.status(400).json({ message: "Merchant already assigned to this counter" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to add merchant", error: err });
  }
});


router.delete('/:counterId/merchant/:merchantId', async (req, res) => {
  try {
    const counter = await Counter.findById(req.params.counterId);

    if (!counter) {
      return res.status(404).json({ message: "Counter not found" });
    }

    counter.merchants = counter.merchants.filter(
      (merchantId) => !merchantId.equals(req.params.merchantId)
    );

    await counter.save();
    res.status(200).json({ message: "Merchant removed from counter", counter });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove merchant", error: err });
  }
});


router.delete('/:counterId', async (req, res) => {
  try {
    const counter = await Counter.findByIdAndDelete(req.params.counterId);
    await Dish.deleteMany({ counter: req.params.counterId });
    if (!counter) {
      return res.status(404).json({ message: "Counter not found" });
    }

    res.status(200).json({ message: "Counter deleted", counter });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete counter", error: err });
  }
});

module.exports = router;
