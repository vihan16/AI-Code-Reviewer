
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  reviewResult: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for now to allow guest reviews if we want, or make true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
