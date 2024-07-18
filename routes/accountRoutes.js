const express = require("express");
const {
  protect,
  admin,
  staff,
  includeOf,
} = require("../middlewares/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/accountController");

const router = express.Router();

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/").get(protect, includeOf(["Admin", "Staff"]), getUsers);

router
  .route("/:id")
  .get(protect, includeOf(["Admin", "Staff"]), getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
