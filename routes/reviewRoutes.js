const express = require("express");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createReview).get(getReviews);


router
  .route("/:id")
  .get(protect, getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
