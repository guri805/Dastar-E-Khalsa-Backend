// models/Subcategory.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const subcategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category
    group: { type: String, required: true } // Group could be Junior, Senior, Expert
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
