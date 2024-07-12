const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').not().isEmpty().withMessage('Comment is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { rating, comment } = req.body;

        const review = new Review({
            rating,
            comment,
            customer: req.user._id
        });

        const createdReview = await review.save();
        res.status(201).json(createdReview);
    })
];

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
const getReviews = [
    asyncHandler(async (req, res) => {
        const reviews = await Review.find({}).populate("customer", "_id name email phone avatar");
        res.json(reviews);
    })
];

// @desc    Get review by id
// @route   GET /api/reviews/:id
// @access  Private/Admin
const getReviewById = [
    param('id').isMongoId().withMessage('Invalid Review ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const review = await Review.findById(req.params.id).populate("customer", "_id name email phone avatar");
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    })
];

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReview = [
    param('id').isMongoId().withMessage('Invalid Review ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').not().isEmpty().withMessage('Comment is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { rating, comment, status } = req.body;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        review.status = status || review.status;

        const updatedReview = await review.save();
        res.json(updatedReview);
    })
];

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = [
    param('id').isMongoId().withMessage('Invalid Review ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;

        const review = await Review.findByIdAndDelete(id);

        if (review) {
            return res.json({ message: 'Review removed' });
        } else
            return res.status(404).json({ message: 'Review not found' });

    })
];

module.exports = {
    createReview,
    getReviews,
    getReviewById,
    updateReview,
    deleteReview
};
