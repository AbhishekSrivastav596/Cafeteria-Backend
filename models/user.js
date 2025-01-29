const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true }, 
    quantity: { type: Number, required: true, min: 1 },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String}, 
    role: { type: String, enum: ['admin', 'merchant', 'customer'], default: 'customer', required: true },
    cart: { type: [cartItemSchema], default: [] },
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next();
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User
