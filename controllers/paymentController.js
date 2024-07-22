const Payment = require('../models/Payment');
const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');

// @desc    Create a payment
// @route   POST /api/payment
// @access  Public
const createPayment = [
    
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().isMobilePhone('any').withMessage('Please enter a valid phone number'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, description } = req.body;

        const payment = new Payment({
            name,
            email,
            phone,
            description
        });

        const createdPayment = await payment.save();
        res.status(201).json(createdPayment);
    })
];

// @desc    Get all payments
// @route   GET /api/payment
// @access  Private/Admin
const getPayments = [
    asyncHandler(async (req, res) => {
        const payments = await Payment.find({});
        res.json(payments);
    })
];

// @desc    Get a payment by ID
// @route   GET /api/payment/:id
// @access  Private/Admin
const getPaymentById = [
    param('id').isMongoId().withMessage('Invalid payment ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const payment = await Payment.findById(req.params.id);

        if (payment) {
            res.json(payment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    })
];

// @desc    Update a payment
// @route   PUT /api/payment/:id
// @access  Private/Admin
const updatePayment = [
    param('id').isMongoId().withMessage('Invalid payment ID'),
    body('name').optional().not().isEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Please enter a valid email'),
    body('phone').optional().isMobilePhone('any').withMessage('Please enter a valid phone number'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const payment = await Payment.findById(req.params.id);

        if (payment) {
            payment.name = req.body.name || payment.name;
            payment.email = req.body.email || payment.email;
            payment.phone = req.body.phone || payment.phone;
            payment.description = req.body.description || payment.description;

            const updatedPayment = await payment.save();
            res.json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    })
];

// @desc    Delete a payment
// @route   DELETE /api/payment/:id
// @access  Private/Admin
const deletePayment = [
    param('id').isMongoId().withMessage('Invalid payment ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const payment = await Payment.findByIdAndDelete(req.params.id);

        if (payment) {
            res.json({ message: 'Payment removed' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    })
];

module.exports = {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment
};
