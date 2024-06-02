const mongoose = require('mongoose');

// Define the schema for the Review
const reviewSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu', // Reference to the MenuItem model
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    username: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true
    // },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Review model from the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
