const Account = require("../models/Account");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = [
  
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
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, phone, role } = req.body;

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
    });
    if (user) {
      const { accessToken, refreshToken } = generateToken(user._id);
      user.refreshToken = refreshToken;
      await user.save();
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  }),
];

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = [
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await Account.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);
      user.refreshToken = refreshToken;
      await user.save();
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  }),
];

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { refreshToken } = req.body;

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      if (decoded.type !== "refresh") {
        return res.status(401).json({ message: "Invalid token type" });
      }
      const user = await Account.findById(decoded.id);
      console.log(user);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      const generateTokenResult = generateToken(user._id);
      user.refreshToken = generateTokenResult.refreshToken;
      await user.save();
      res.json({
        accessToken: generateTokenResult.accessToken,
        refreshToken: generateTokenResult.refreshToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  }),
];

// @desc    Forgot password - Generate forget password token and send email
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = [
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await Account.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { forgetPassToken } = generateToken(user._id);

    const resetUrl = `${process.env.CLIENT_URL}/forgotpasscode?forgetToken=${forgetPassToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

    try {
      const transporter = nodemailer.createTransport({
        // host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT || 465,
        // secure: true,
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `StyleCuts <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Token",
        text: message,
      });

      res.status(200).json({ message: "Email sent" });
    } catch (err) {
      console.error(err);

      res.status(500).json({ message: "Email could not be sent" });
    }
  }),
];

// @desc    Reset password using forget password token
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
const resetPassword = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const forgetPassToken = req.params.token;
    const { password } = req.body;

    try {
      const decoded = jwt.verify(forgetPassToken, process.env.JWT_SECRET);
      if (decoded.type !== "forget-password") {
        return res.status(400).json({ message: "Invalid token type" });
      }

      const user = await Account.findById(decoded.id);

      if (!user) {
        return res.status(400).json({ message: "Invalid token" });
      }

      user.password = password;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Invalid token" });
    }
  }),
];

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      if (decoded.type !== "refresh") {
        return res.status(401).json({ message: "Invalid token type" });
      }

      const user = await Account.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      user.refreshToken = null; // Xóa refresh token khỏi cơ sở dữ liệu
      await user.save();

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  }),
];

module.exports = {
  registerUser,
  authUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  logoutUser,
};
