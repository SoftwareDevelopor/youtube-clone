const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  },
  downloads: [
    {
      date: { type: Date, required: true },
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'videos', required: true }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 