const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  merchants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }] 
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter
