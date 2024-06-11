const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// Add item to cart
router.post('/cart', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        let cartItem = await CartItem.findOne({ userId, product: productId });

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cartItem = new CartItem({ userId, product: productId, quantity: 1 });
        }

        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/cart/:cartItemId', async (req, res) => {
    try {
        const cartItemId = req.params.cartItemId;
        const cartItem = await CartItem.findById(cartItemId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.remove();
        res.json({ message: 'Cart item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get cart items for a user
router.get('/cart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cartItems = await CartItem.find({ userId }).populate('product');
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
