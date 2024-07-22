const express = require('express');
const { createPayment, getPayments, getPaymentById, updatePayment, deletePayment } = require('../controllers/paymentController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .post(protect, createPayment)
    .get(protect, admin, getPayments);

router.route('/:id')
    .get(protect, admin, getPaymentById)
    .put(protect, admin, updatePayment)
    .delete(protect, admin, deletePayment);

module.exports = router;
