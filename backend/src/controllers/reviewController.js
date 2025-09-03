const Review = require('../models/Review');
const { generateReview } = require('../services/geminiServices');

exports.submitReview = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code is required.' });

    const reviewText = await generateReview(code);
    if (!reviewText) {
      return res.status(500).json({ error: 'Review could not be generated.' });
    }

    
    const savedReview = await Review.create({ code, reviewResult: reviewText });
    res.status(201).json({
      id: savedReview._id,
      original: savedReview.code,
      reviewed: savedReview.reviewResult,
      createdAt: savedReview.createdAt,
    });
  } catch (err) {
    // next(err);
    console.error('Submit Review Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    // next(err);
    console.error('Get Reviews Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
