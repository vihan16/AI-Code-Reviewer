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

    // Save review with user ID if authenticated
    const reviewData = { code, reviewResult: reviewText };
    if (req.user) {
      reviewData.user = req.user.id;
    }

    const savedReview = await Review.create(reviewData);
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
    // If user is authenticated, get their reviews. Else return empty or public?
    // For this app, let's say history is only for logged in users.
    if (!req.user) {
      return res.json([]); 
    }

    const reviews = await Review.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    // next(err);
    console.error('Get Reviews Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
