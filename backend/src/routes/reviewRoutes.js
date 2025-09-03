const express = require('express');
const router = express.Router();
const { submitReview, getReviews } = require('../controllers/reviewController');

router.get('/vih', (req, res) => {
  res.send('Review API is running');
});//new route


router.post('/', submitReview);
router.get('/', getReviews);

module.exports = router;
