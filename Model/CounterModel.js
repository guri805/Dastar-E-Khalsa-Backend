const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
    count: { type: Number, default: 0 }, // Default count is 0
}, { timestamps: true });

CounterSchema.index({ categoryId: 1, subcategoryId: 1 }, { unique: true }); 

const CounterModel = mongoose.model("Counter", CounterSchema);
module.exports = CounterModel;
