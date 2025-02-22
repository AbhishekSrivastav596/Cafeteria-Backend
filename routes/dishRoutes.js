const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');
const Counter = require('../models/counter');
const { authorizeRoles } = require('../middleware/authMiddleware');
require('../models/counter');
const verifyToken = require("../middleware/authMiddleware");



router.get('/', async (req, res) => {
    try {
        const dishes = await Dish.find().populate('counter'); 
        res.status(200).json({message:'Fetched all dishes successfully',dishes});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch dishes', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id).populate('counter');
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.status(200).json({message:'Fetched dish successfully',dish});
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dish', error });
    }
});

router.get('/counter/:counterId', async (req, res) => {
    try {
        const dishes = await Dish.find({ counter: req.params.counterId }).populate('counter');
        if (!dishes.length) {
            return res.status(404).json({ message: 'No dishes found for this counter' });
        }
        res.status(200).json({ message: 'Fetched dishes successfully', dishes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dishes', error });
    }
  });
  

router.post('/',verifyToken, authorizeRoles('merchant'), async (req, res) => {
    try {
        const { name, price, stock, description, counter, imageUrl } = req.body;
        const merchantId = req.user.id; 

        const counterData = await Counter.findById(counter);

        if (!counterData) {
            return res.status(404).json({ message: "Counter not found" });
        }

        if (!counterData.merchants.includes(merchantId)) {
            return res.status(403).json({ message: "Unauthorized to add dishes to this counter" });
        }

        const newDish = new Dish({ name, price, stock, description, counter, imageUrl });
        await newDish.save();
        res.status(201).json({message:'New dish created successfully',newDish});
    } catch (error) {
        res.status(400).json({ message: 'Failed to create dish', error });
    }
});

router.patch('/:id', verifyToken,authorizeRoles('merchant'), async (req, res) => {
    try {
        const merchantId = req.user.id;
        console.log("merhcantID: ", merchantId);
        const dish = await Dish.findById(req.params.id);
        
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        const counterData = await Counter.findById(dish.counter);
        console.log("counterData: ",counterData);
        
        if (!counterData.merchants.includes(merchantId)) {
            return res.status(403).json({ message: "Unauthorized to update this dish" });
        }

        const updatedDish = await Dish.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({message:'Dish updated successfully',updatedDish});
    } catch (error) {
        res.status(400).json({ message: 'Failed to update dish', error });
    }
});

router.delete('/:id', verifyToken,authorizeRoles('merchant'), async (req, res) => {
    try {
        const merchantId = req.user.id;
        
        const dish = await Dish.findById(req.params.id);

        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        const counterData = await Counter.findById(dish.counter);
        if (!counterData.merchants.includes(merchantId)) {
            return res.status(403).json({ message: "Unauthorized to delete this dish" });
        }
        await Dish.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete dish', error });
    }
});

module.exports = router;

