const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI, {
           retryWrites: true,
           w: 'majority'
       })
       .then(() => console.log('Mongo DB connected successfully'));
    } catch (error) {
        console.error('MongoDB connection Error: ', error);
    }
};

module.exports = connectDB;