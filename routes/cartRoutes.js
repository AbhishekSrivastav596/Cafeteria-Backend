const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authorizeRoles }= require('../middleware/authMiddleware');




async function fetchUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id).populate('cart.dish');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user; 
    next();
  } catch (error) {
    res.status(500).json({ message: 'Process failed', error });
  }
}

router.use(fetchUser);


router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const cart = req.user.cart;
    res.status(200).json({ message: 'successfully fetched', cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error });
  }
});

router.post('/add', authorizeRoles('customer'),async (req, res) => {
  const { dishId, quantity } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const existingItem = req.user.cart.find((item) => item.dish._id.toString() === dishId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      req.user.cart.push({ dish: dishId, quantity });
    }

    await req.user.save().then(u => u.populate('cart.dish'));
    res.status(200).json({ message: 'Item added to cart', cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart', error });
  }
});

router.delete('/remove/:dishId',authorizeRoles('customer'), async (req, res) => {
  const { dishId } = req.params;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    console.log(dishId)
    req.user.cart = req.user.cart.filter((item) => item.dish._id.toString() !== dishId);

    await req.user.save();
    res.status(200).json({ message: 'Item removed from cart', cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from cart', error });
    console.log(req.user.cart);
  }
});

router.patch('/:dishId',authorizeRoles('customer'), async (req, res) => {
  const { changeQuantity } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const item = req.user.cart.find(item => item.dish._id.toString() === req.params.dishId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity += changeQuantity;
    await req.user.save();
    res.status(200).json(req.user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item quantity', error });
  }
});


router.delete('/clear/:userId',authorizeRoles('customer'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user.cart = [];
    await req.user.save();
    res.status(200).json({ message: 'Cart cleared successfully', cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error });
  }
});


module.exports = router;
