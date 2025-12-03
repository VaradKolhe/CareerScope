const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  history: [
    {
      module: { 
        type: String, 
        required: true 
      },
      topPrediction: { 
        type: String, 
        required: true 
      },
      confidence: { 
        type: Number, 
        required: true 
      },
      summary: { 
        type: String 
      },
      date: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);