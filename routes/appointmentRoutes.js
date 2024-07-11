const express = require('express');
const { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect, admin, staff, includeOf } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, createAppointment)
    .get(protect, includeOf(["Admin", "Staff"]), getAppointments);

router.route('/:id')
    .get(protect, getAppointmentById)
    .put(protect, includeOf(["Admin", "Staff"]), updateAppointment)
    .delete(protect, admin, deleteAppointment);

module.exports = router;
