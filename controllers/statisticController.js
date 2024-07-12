const asyncHandler = require('express-async-handler');
const { query, validationResult, param } = require('express-validator');
const Appointment = require('../models/Appointment');

// @desc    Get revenue statistics
// @route   GET /api/statistics/revenue
// @access  Private/Admin
const getRevenueStatistics = [
    query('startDate').isDate().withMessage('Start date must be a valid date'),
    query('endDate').isDate().withMessage('End date must be a valid date'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { startDate, endDate } = req.query;

        const appointments = await Appointment.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            paymentStatus: 'Paid'
        });

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const actualRevenue = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);
        res.json({ totalRevenue, actualRevenue });
    })
];

// @desc    Get profit statistics
// @route   GET /api/statistics/profit
// @access  Private/Admin
const getProfitStatistics = [
    query('startDate').isDate().withMessage('Start date must be a valid date'),
    query('endDate').isDate().withMessage('End date must be a valid date'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { startDate, endDate } = req.query;

        const appointments = await Appointment.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            paymentStatus: 'Paid'
        });

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const totalActualPayment = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);
        const totalProfit = totalActualPayment - totalRevenue;

        res.json({ totalProfit });
    })
];

// @desc    Get financial report
// @route   GET /api/statistics/financial-report
// @access  Private/Admin
const getFinancialReport = [
    query('startDate').isDate().withMessage('Start date must be a valid date'),
    query('endDate').isDate().withMessage('End date must be a valid date'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { startDate, endDate } = req.query;

        const appointments = await Appointment.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            paymentStatus: 'Paid'
        });

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const totalActualPayment = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);
        const totalProfit = totalActualPayment - totalRevenue;

        res.json({
            totalRevenue,
            totalProfit,
            appointments
        });
    })
];

// @desc    Get revenue statistics in a Salon
// @route   GET /api/statistics/revenue
// @access  Private/Admin
const getRevenueStatisticsInSalon = [
    param('salonId').isMongoId().withMessage('Invalid salon ID'),
    query('startDate').isDate().withMessage('Start date must be a valid date'),
    query('endDate').isDate().withMessage('End date must be a valid date'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { salonId } = req.params;
        const { startDate, endDate } = req.query;

        const appointments = await Appointment.find({
            salon: salonId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            paymentStatus: 'Paid'
        });

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const actualRevenue = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);
        res.json({ totalRevenue, actualRevenue });
    })
];

// @desc    Get profit statistics in a Salon
// @route   GET /api/statistics/profit
// @access  Private/Admin
const getProfitStatisticsInSalon = [
    param('salonId').isMongoId().withMessage('Invalid salon ID'),
    query('startDate').isDate().withMessage('Start date must be a valid date'),
    query('endDate').isDate().withMessage('End date must be a valid date'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { salonId } = req.params;
        const { startDate, endDate } = req.query;

        const appointments = await Appointment.find({
            salon: salonId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            paymentStatus: 'Paid'
        });

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const totalActualPayment = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);
        const totalProfit = totalActualPayment - totalRevenue;

        res.json({ totalProfit });
    })
];

// @desc    Get financial report in a Salon
// @route   GET /api/statistics/financial-report
// @access  Private/Admin
const getFinancialReportInSalon = [
    param('salonId').isMongoId().withMessage('Invalid salon ID'),
    query('startDate').isDate().withMessage('Start date must be a valid date'),
    query('endDate').isDate().withMessage('End date must be a valid date'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { salonId } = req.params;
        const { startDate, endDate } = req.query;

        const appointments = await Appointment.find({
            salon: salonId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            paymentStatus: 'Paid'
        });

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const totalActualPayment = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);
        const totalProfit = totalActualPayment - totalRevenue;

        res.json({
            totalRevenue,
            totalProfit,
            appointments
        });
    })
];
module.exports = {
    getRevenueStatistics,
    getProfitStatistics,
    getFinancialReport,
    getRevenueStatisticsInSalon,
    getProfitStatisticsInSalon,
    getFinancialReportInSalon
};
