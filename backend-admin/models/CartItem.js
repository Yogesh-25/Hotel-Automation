const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Menu' // Reference to the Menu model
    },
    quantity: { type: Number, required: true, default: 1 }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
