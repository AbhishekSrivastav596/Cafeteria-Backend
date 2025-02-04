const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Boolean, default: true, required: true },
  description: { type: String, required: true }, 
  imageUrl : { type: String },
  counter: { type: mongoose.Schema.Types.ObjectId, ref: 'Counter',default:null }, 
});

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish
