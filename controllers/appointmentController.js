const Appointment = require("../models/Appointment");
const { body, validationResult, param } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Payment = require("../models/Payment");
const Combo = require("../models/Combo");

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = [
  body("date").not().isEmpty().withMessage("Date is required"),
  body("timeStart").not().isEmpty().withMessage("Start time is required"),
  body("timeEnd").not().isEmpty().withMessage("End time is required"),
  body("totalPrice").isNumeric().withMessage("Total price must be a number"),
  body("salon").isMongoId().withMessage("Invalid Salon ID"),
  body("customer").isMongoId().withMessage("Invalid Customer ID"),
  body("staff").isMongoId().withMessage("Invalid Staff ID"),
  body("paymentStatus")
    .optional()
    .isIn(["Pending", "Paid", "Failed"])
    .withMessage("Invalid Payment Status"),
  body("paymentMethod")
    .not()
    .isEmpty()
    .withMessage("Payment method is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      date,
      timeStart,
      timeEnd,
      totalPrice,
      salon,
      customer,
      services,
      combos,
      staff,
      paymentStatus,
      paymentMethod,
      paymentInfo,
    } = req.body;
    try {
      const newAppointment = new Appointment({
        date,
        timeStart,
        timeEnd,
        totalPrice,
        salon,
        customer,
        services,
        combos,
        staff,
        paymentStatus,
        paymentMethod,
        paymentInfo: paymentInfo
          ? paymentInfo?._id || (await new Payment(paymentInfo).save())._id
          : null,
      });

      const appointment = await newAppointment.save();
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),
];

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private /Admin|Staff
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate("salon")
    .populate("customer", "_id name email phone avatar")
    .populate("services")
    .populate("combos")
    .populate("staff", "_id name email phone avatar")
    .populate("paymentInfo");
  res.json(appointments);
});

// @desc    Get a single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = [
  param("id").isMongoId().withMessage("Invalid Appointment ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const appointment = await Appointment.findById(req.params.id)
      .populate("salon")
      .populate("customer", "_id name email phone avatar")
      .populate("services")
      .populate("combos")
      .populate("staff", "_id name email phone avatar")
      .populate("paymentInfo");

    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  }),
];

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = [
  param("id").isMongoId().withMessage("Invalid Appointment ID"),
  body("date").not().isEmpty().withMessage("Date is required"),
  body("timeStart").not().isEmpty().withMessage("Start time is required"),
  body("timeEnd").not().isEmpty().withMessage("End time is required"),
  body("totalPrice").isNumeric().withMessage("Total price must be a number"),
  body("salon").isMongoId().withMessage("Invalid Salon ID"),
  body("customer").isMongoId().withMessage("Invalid Customer ID"),
  body("staff").isMongoId().withMessage("Invalid Staff ID"),
  body("paymentStatus")
    .optional()
    .isIn(["Pending", "Paid", "Failed"])
    .withMessage("Invalid Payment Status"),
  body("paymentMethod")
    .not()
    .isEmpty()
    .withMessage("Payment method is required"),
  body("status")
    .optional()
    .isIn(["Pending", "Confirmed", "Completed", "Cancelled"])
    .withMessage("Invalid Status"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      const {
        date,
        timeStart,
        timeEnd,
        totalPrice,
        salon,
        customer,
        services,
        combos,
        staff,
        paymentStatus,
        paymentMethod,
        paymentInfo,
        status,
      } = req.body;
      appointment.date = date || appointment.date;
      appointment.timeStart = timeStart || appointment.timeStart;
      appointment.timeEnd = timeEnd || appointment.timeEnd;
      appointment.totalPrice = totalPrice || appointment.totalPrice;
      appointment.salon = salon || appointment.salon;
      appointment.customer = customer || appointment.customer;
      appointment.services = services || appointment.services;
      appointment.combos = combos || appointment.combos;
      appointment.staff = staff || appointment.staff;
      appointment.paymentStatus = paymentStatus || appointment.paymentStatus;
      appointment.paymentMethod = paymentMethod || appointment.paymentMethod;
      appointment.paymentInfo = paymentInfo || appointment.paymentInfo;
      appointment.status = status || appointment.status;

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),
];

// @desc    Delete an appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = [
  param("id").isMongoId().withMessage("Invalid Appointment ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const appointment = await Appointment.findByIdAndDelete(req.params.id);
      if (appointment) {
        return res.json({ message: "Appointment removed" });
      }
      res.status(404).json({ message: "Appointment not found" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),
];

// @desc    Get a appointment by account id
// @route   GET /api/appointments/getByAccountId/:id
// @access  Private
const getAppointmentByAccountId = [
  param("id").isMongoId().withMessage("Invalid Appointment ID"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const appointment = await Appointment.find({ customer: req.params.id })
      .populate("salon")
      .populate("customer", "_id name email phone avatar")
      .populate("services")
      .populate("combos")
      .populate("staff", "_id name email phone avatar")
      .populate("paymentInfo");

    if (appointment) {
      const result = await Promise.all(
        appointment.map(async (ap) => {
          return {
            ...ap._doc,
            combos: await Promise.all(
              ap.combos.map(
                async (cb) => await new Combo(cb).populateServices()
              )
            ),
          };
        })
      );
      res.json(result);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  }),
];
// @desc    Update Status an appointment
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin|Staff
const updateAppointmentStatus = [
  body("status")
    .notEmpty()
    .isIn(["Pending", "Confirmed", "Completed", "Cancelled"])
    .withMessage("Invalid Status"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      const {
        status
      } = req.body;
      appointment.status = status || appointment.status;

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }),
];
module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getAppointmentByAccountId,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus
};
