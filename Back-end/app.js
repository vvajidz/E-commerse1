
const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true                
}));
app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err);
  });

const authRoutes = require('./routes/authRouter');
const userRoutes = require('./routes/userRouter');
const adminRoutes = require('./routes/adminRouter');


app.use('/api/auth', authRoutes);      
app.use('/api/user', userRoutes);     
app.use('/api/admin', adminRoutes);    


app.get('/', (req, res) => {
    res.send(' Backend server is running...');
});


app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});
