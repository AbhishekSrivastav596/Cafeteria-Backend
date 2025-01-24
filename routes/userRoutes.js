const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Dish = require('../models/dish');
const Counter = require('../models/counter');  

router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('cart.dish'); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const users = await User.find({role:'admin'}).select('-cart');  
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
});

router.get('/merchant', async (req, res) => {
  try {
    const users = await User.find({ role: 'merchant' }).populate('cart.dish'); 
    for (const user of users) {
      const counters = await Counter.find({ merchants: user._id });
      if (counters.length === 0) {
        user.counters = 'No counters found';
      } else {
        user.counters = counters;
      }
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users with counters", error: err });
  }
});


router.get('/customer', async (req, res) => {
  try {
    const users = await User.find().populate('cart.dish');  
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customers", error: err });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, role, cart } = req.body;
    const newUser = new User({ name, email, role, cart });
    await newUser.save();
    res.status(201).json({ message: "New user created", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err });
  }
});


module.exports = router;
