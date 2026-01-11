const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       });
    } catch (error) {
        console.error('MongoDB connection Error: ', error);
    }
};

export default connectDB;