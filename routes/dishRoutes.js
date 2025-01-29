const express = require('express');
const router = express.Router();
const Dish = require('../models/dish');
require('../models/counter');

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

router.post('/', async (req, res) => {
    try {
        const { name, price, stock, description, counter } = req.body;
        const newDish = new Dish({ name, price, stock, description, counter });
        await newDish.save();
        res.status(201).json({message:'New dish created successfully',newDish});
    } catch (error) {
        res.status(400).json({ message: 'Failed to create dish', error });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedDish = await Dish.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDish) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.status(200).json({message:'Dish updated successfully',updatedDish});
    } catch (error) {
        res.status(400).json({ message: 'Failed to update dish', error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedDish = await Dish.findByIdAndDelete(req.params.id);
        if (!deletedDish) {
            return res.status(404).json({ message: 'Dish not found' });
        }
        res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete dish', error });
    }
});

module.exports = router;

