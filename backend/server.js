require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit'); // Import rate limiter

const app = express();
const PORT = process.env.PORT || 5001;

// --- 1. RATE LIMITER CONFIGURATION ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all API requests
app.use('/api', apiLimiter);

// Middleware
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/profile', require('./routes/profile'));

// Test Route
app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => {
    console.log(`Node Server running on port ${PORT}`);
});