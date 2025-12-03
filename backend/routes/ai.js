const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get Python URL from .env (default to localhost:5000 if missing)
const AI_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5000';

// @route   POST api/ai/generate_quiz
// @desc    Proxy to Python: Generate Quiz
// @access  Public (or Protected if you want)
router.post('/generate_quiz', async (req, res) => {
    try {
        // 1. Forward the data from React (req.body) to Python
        const response = await axios.post(`${AI_URL}/generate_quiz`, req.body);
        
        // 2. Send Python's answer back to React
        res.json(response.data);
    } catch (error) {
        console.error("Error connecting to AI Service:", error.message);
        // Handle specific error responses from Python
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ msg: 'AI Service Unavailable' });
    }
});

// @route   POST api/ai/evaluate_quiz
// @desc    Proxy to Python: Evaluate & Predict
// @access  Public
router.post('/evaluate_quiz', async (req, res) => {
    try {
        const response = await axios.post(`${AI_URL}/evaluate_quiz`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Error connecting to AI Service:", error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ msg: 'AI Service Unavailable' });
    }
});

module.exports = router;