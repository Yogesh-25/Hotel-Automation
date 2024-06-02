// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Category', categorySchema);
