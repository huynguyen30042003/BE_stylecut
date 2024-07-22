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
  createUser,
  changePassword,
} = require("../controllers/accountController");

const router = express.Router();

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/change-password").put(protect, changePassword);
router
  .route("/")
  .get(protect, includeOf(["Admin", "Staff"]), getUsers)
  .post(protect, admin, createUser);
router
  .route("/:id")
  .get(protect, includeOf(["Admin", "Staff"]), getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
