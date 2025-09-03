const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  code: { type: String, required: true },
  reviewResult: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);