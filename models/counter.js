const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  merchants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  imageUrl : { type: String },
  description: {type:String},
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter
