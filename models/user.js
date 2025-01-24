const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true }, 
    quantity: { type: Number, required: true, min: 1 },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'merchant', 'customer'], default: 'customer', required: true },
    cart: [cartItemSchema], 
});


const User = mongoose.model('User', userSchema);

module.exports = User
