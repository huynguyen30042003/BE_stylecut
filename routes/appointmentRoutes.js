const express = require("express");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentByAccountId,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const {
  
  protect,
  admin,
  staff,
  includeOf,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, createAppointment)
  .get(protect, includeOf(["Admin", "Staff"]), getAppointments);
router
  .route("/:id/status")
  .put(protect, includeOf(["Admin", "Staff"]), updateAppointmentStatus)
router
  .route("/:id")
  .get(protect, getAppointmentById)
  .put(protect, includeOf(["Admin", "Staff"]), updateAppointment)
  .delete(protect, admin, deleteAppointment);

router.route("/getByAccountId/:id").get(protect, getAppointmentByAccountId);

module.exports = router;
