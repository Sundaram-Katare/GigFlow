const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bidRoutes = require('./routes/bidRoutes');

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/gig', gigRoutes);
app.use('/api/bid', bidRoutes);

app.get('/', (req, res) => {
    res.send('Hello from the backend server');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});