const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        fullName: { type: String, required: true, trim: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        fatherName: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        hometown: { type: String, required: true, trim: true },
        whatsappNumber: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        schoolOrCollege: { type: String, required: true, trim: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories", required: true },
        subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
        // tokenNumber: { type: String, required: true }
    },
    { timestamps: true }
);

const ParticipantModel = mongoose.model("Participant", ParticipantSchema);
module.exports = ParticipantModel;
