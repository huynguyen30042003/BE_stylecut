const Account = require("../models/Account");
const asyncHandler = require("express-async-handler");
const { validationResult, body, param } = require("express-validator");
const bcrypt = require("bcryptjs");
// @desc    Get user profile
// @route   GET /api/accounts/profile
// @access  Private
const getUserProfile = [
  asyncHandler(async (req, res) => {
    const user = await Account.findById(req.user._id).select(
      "_id name email phone avatar role"
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }),
];

// @desc    Update user profile
// @route   PUT /api/accounts/profile
// @access  Private
const updateUserProfile = [
  body("name")
    .optional()
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("avatar").optional().isURL().withMessage("Avatar is Url to Image"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await Account.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }),
];

// @desc    Get all users
// @route   GET /api/accounts
// @access  Private/Admin|Staff
const getUsers = [
  asyncHandler(async (req, res) => {
    const users = await Account.find({}).select(
      "-password -refreshToken -otp -otpExpires"
    );
    res.json(users);
  }),
];

// @desc    Delete a user
// @route   DELETE /api/accounts/:id
// @access  Private/Admin
const deleteUser = [
  param("id").isMongoId().withMessage("Invalid Account ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await Account.findByIdAndDelete(req.params.id);

    if (user) {
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }),
];

// @desc    Get user by ID
// @route   GET /api/accounts/:id
// @access  Private/Admin|Staff
const getUserById = [
  param("id").isMongoId().withMessage("Invalid Account ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await Account.findById(req.params.id).select(
      "-password -refreshToken -otp -otpExpires"
    );

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }),
];
// @desc    Create user
// @route   POST /api/accounts
// @access  Private/Admin
const createUser = [
  body("name").trim().not().isEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number"),
  body("role")
    .optional()
    .isIn(["Customer", "Staff", "Admin"])
    .withMessage("Invalid user role"),
  body("avatar").optional().isURL().withMessage("Avatar is Url to Image"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, phone, role, avatar } = req.body;

    const userExists = await Account.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "This Email registered!" });
    }
    const userPhoneExists = await Account.findOne({ phone });

    if (userPhoneExists) {
      return res.status(400).json({ message: "This Phone registered!" });
    }

    const user = await Account.create({
      name,
      email,
      password,
      phone,
      role,
      avatar,
    });
    if (user) {
      await user.save();
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  }),
];

// @desc    Update user by ID
// @route   PUT /api/accounts/:id
// @access  Private/Admin
const updateUser = [
  param("id").isMongoId().withMessage("Invalid Account ID"),
  body("name").trim().not().isEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please enter a valid phone number"),
  body("role")
    .optional()
    .isIn(["Customer", "Staff", "Admin"])
    .withMessage("Invalid user role"),
  body("avatar").optional().isURL().withMessage("Avatar is Url to Image"),
  body("status").optional().isBoolean().withMessage("Invalid user status"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await Account.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.role = req.body.role || user.role;
      user.avatar = req.body.avatar || user.avatar;
      user.status = req.body.status || user.status;
      user.password = req.body.password || user.password;

      const updatedUser = await user.save();
      delete updatedUser.refreshToken;
      delete updatedUser.otpExpires;
      delete updatedUser.otp;
      delete updateUser.password;

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }),
];
// @desc    Change password
// @route   PUT /api/accounts/change-password
// @access  Private
const changePassword = [
  body("oldPassword")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("newPassword")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await Account.findById(req.user._id);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      if (!bcrypt.compareSync(oldPassword, user.password))
        return res.status(400).json({ message: "Password is incorrect" });
      user.password = newPassword;
      await user.save();
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }),
];

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  createUser,
  updateUser,
  changePassword,
};
