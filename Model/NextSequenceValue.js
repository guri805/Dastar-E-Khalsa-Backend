const Counter = require("../models/Counter");

const getNextSequenceValue = async (sequenceName) => {
    const counter = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } }, // Increment sequence by 1
        { new: true, upsert: true } // Create if not exists
    );

    return counter.sequence_value; // Return updated value
};

module.exports = getNextSequenceValue;
