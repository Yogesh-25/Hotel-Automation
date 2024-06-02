// const mongoose = require('mongoose');

// const menuSchema = new mongoose.Schema({
//     productName: { type: String, required: true },
//     productId: { type: Number, required: true },
//     rating: { type: Number, required: true },
//     price: { type: Number, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     image: {
//         data: Buffer,
//         contentType: String
//     }
// });

// const Menu = mongoose.model('Menu', menuSchema);

// module.exports = Menu;

const mongoose = require('mongoose');
const Review = require('./Review'); // Import the Review model

const menuSchema = new mongoose.Schema({
    productName: String,
    productId: String,
    rating: Number,
    price: Number,
    category: String,
    description: String,
    image: {
        data: Buffer,
        contentType: String
    }
});

// Pre - remove hook to delete associated reviews
menuSchema.pre('remove', async function (next) {
    try {
        await Review.deleteMany({ menuItemId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;

