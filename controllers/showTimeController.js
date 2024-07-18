const ShowTime = require("../models/ShowTime");
const asyncHandler = require("express-async-handler");
const { body, validationResult, param } = require("express-validator");

// @desc    Create a new show time
// @route   POST /api/showtimes
// @access  Private/Admin
const createShowTime = [
  body("date").isDate().withMessage("Date must be a valid date"),
  body("timeStart").notEmpty().withMessage("Start time is required"),
  body("timeEnd").notEmpty().withMessage("End time is required"),
  body("staff").isMongoId().withMessage("Staff must be a valid ObjectId"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, timeStart, timeEnd, staff } = req.body;

    const showTime = new ShowTime({
      date,
      timeStart,
      timeEnd,
      staff,
    });

    const createdShowTime = await showTime.save();
    res.status(201).json(createdShowTime);
  }),
];

// @desc    Get all show times
// @route   GET /api/showtimes
// @access  Public
const getShowTimes = [
  asyncHandler(async (req, res) => {
    const { date } = req.query;
    let showTimes;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      showTimes = await ShowTime.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).populate("staff", "_id email name phone avatar");
    } else {
      showTimes = await ShowTime.find({}).populate(
        "staff",
        "_id email name phone avatar"
      );
    }

    res.json(showTimes);
  }),
];

// @desc    Get a single show time by ID
// @route   GET /api/showtimes/:id
// @access  Public
const getShowTimeById = [
  param("id").isMongoId().withMessage("Invalid ShowTime ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    s;
    const showTime = await ShowTime.findById(req.params.id).populate(
      "staff",
      "_id email name phone avatar"
    );

    if (showTime) {
      res.json(showTime);
    } else {
      res.status(404).json({ message: "Show time not found" });
    }
  }),
];

// @desc    Update a show time
// @route   PUT /api/showtimes/:id
// @access  Private/Admin
const updateShowTime = [
  param("id").isMongoId().withMessage("Invalid ShowTime ID"),
  body("date").isDate().withMessage("date must be a valid date"),
  body("timeStart").notEmpty().withMessage("Start time is required"),
  body("timeEnd").notEmpty().withMessage("End time is required"),
  body("staff").isMongoId().withMessage("Staff must be a valid ObjectId"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, timeStart, timeEnd, staff, status } = req.body;

    const showTime = await ShowTime.findById(req.params.id);

    if (showTime) {
      showTime.date = date || showTime.date;
      showTime.timeStart = timeStart || showTime.timeStart;
      showTime.timeEnd = timeEnd || showTime.timeEnd;
      showTime.staff = staff || showTime.staff;
      showTime.status = status || showTime.status;

      const updatedShowTime = await showTime.save();
      res.json(updatedShowTime);
    } else {
      res.status(404).json({ message: "Show time not found" });
    }
  }),
];

// @desc    Delete a show time
// @route   DELETE /api/showtimes/:id
// @access  Private/Admin
const deleteShowTime = [
  param("id").isMongoId().withMessage("Invalid ShowTime ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const showTime = await ShowTime.findByIdAndDelete(req.params.id);
    if (showTime) {
      res.json({ message: "Show time removed" });
    } else {
      res.status(404).json({ message: "Show time not found" });
    }
  }),
];

module.exports = {
  createShowTime,
  getShowTimes,
  getShowTimeById,
  updateShowTime,
  deleteShowTime,
};
