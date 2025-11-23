const express = require('express');
const router = express.Router();
const { submitReview, getReviews } = require('../controllers/reviewController');

router.get('/vih', (req, res) => {
  res.send('Review API is running');
});//new route


const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/vih', (req, res) => {
  res.send('Review API is running');
});//new route


router.post('/', optionalProtect, submitReview);
router.get('/', optionalProtect, getReviews);

module.exports = router;
