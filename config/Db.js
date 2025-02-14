require('dotenv').config();
const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(async () => {
        console.log('mongoDB is connected');
    })
    .catch((err) => {
        console.log('failed to connect mongoDB', err);
    })