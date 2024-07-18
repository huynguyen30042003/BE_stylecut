const express = require('express');
const {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createReview)
    .get(protect, admin, getReviews);

router.route('/:id')
    .get(protect, admin, getReviewById)
    .put(protect, admin, updateReview)
    .delete(protect, admin, deleteReview);

module.exports = router;
