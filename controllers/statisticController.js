const asyncHandler = require('express-async-handler');
const { query, validationResult, param } = require('express-validator');
const Appointment = require('../models/Appointment');
const Account = require('../models/Account');
const moment = require('moment');

// @desc    Get financial stats
// @route   GET /api/statistics/financial-stats
// @access  Private/Admin|Staff
const getFinancialStats = [
    
    asyncHandler(async (req, res) => {
        const { startDate, endDate } = req.query;
        const startDateGte = startDate ? moment(startDate).startOf('day').toDate() : null;
        const endDateLte = endDate ? moment(endDate).endOf('day').toDate() : null;

        const dateFilter = {};
        if (startDateGte) dateFilter.$gte = startDateGte;
        if (endDateLte) dateFilter.$lte = endDateLte;

        const matchConditions = {
            paymentStatus: 'Paid',
            ...(startDateGte || endDateLte ? { date: dateFilter } : {})
        };

        const appointments = await Appointment.find(matchConditions);

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const totalActualPayment = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);

        const details = appointments.reduce((acc, appointment) => {
            const date = new Date(appointment.createdAt);
            const key = `${date.getMonth() + 1}-${date.getFullYear()}`;

            if (!acc[key]) {
                acc[key] = {
                    totalRevenue: 0,
                    totalActualPayment: 0,
                    // appointments: []
                };
            }

            acc[key].totalRevenue += appointment.totalPrice;
            acc[key].totalActualPayment += appointment.actualPayment;
            // acc[key].appointments.push(appointment);

            return acc;
        }, {});
        const sortedDetails = Object.keys(details).sort((a, b) => {
            const [yearA, monthA] = a.split('-').map(Number);
            const [yearB, monthB] = b.split('-').map(Number);
            return yearA === yearB ? monthA - monthB : yearA - yearB;
        }).reduce((acc, key) => {
            acc[key] = details[key];
            return acc;
        }, {});
        res.json({ totalRevenue, totalActualPayment, details: sortedDetails });
    })
];


// @desc    Get registration stats
// @route   GET /api/statistics/registration-report
// @access  Private/Admin|Staff
//Thống kê số lượng người đăng ký
const getRegistrationStats = [
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { startDate, endDate } = req.query;
        const startDateGte = startDate ? moment(startDate).startOf('day').toDate() : null;
        const endDateLte = endDate ? moment(endDate).endOf('day').toDate() : null;

        const dateFilter = {};
        if (startDateGte) dateFilter.$gte = startDateGte;
        if (endDateLte) dateFilter.$lte = endDateLte;

        const matchConditions = {
            ...(startDateGte || endDateLte ? { createdAt: dateFilter } : {})
        };

        const stats = await Account.aggregate([
            {
                $match: matchConditions
            },
            {
                $project: {
                    monthYear: {
                        $concat: [
                            { $toString: { $month: '$createdAt' } },
                            '-',
                            { $toString: { $year: '$createdAt' } }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$monthYear',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 } // Sort by monthYear
            }
        ]);

        res.json(stats);
    })
];

// @desc    Get most selected service
// @route   GET /api/statistics/most-selected-service
// @access  Private/Admin|Staff
const getMostSelectedService = [
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { startDate, endDate } = req.query;
        const startDateGte = startDate ? moment(startDate).startOf('day').toDate() : null;
        const endDateLte = endDate ? moment(endDate).endOf('day').toDate() : null;

        const dateFilter = {};
        if (startDateGte) dateFilter.$gte = startDateGte;
        if (endDateLte) dateFilter.$lte = endDateLte;

        const matchConditions = {
            ...(startDateGte || endDateLte ? { date: dateFilter } : {})
        };

        const stats = await Appointment.aggregate([
            { $match: matchConditions },
            { $unwind: '$services' },
            {
                $group: {
                    _id: '$services',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            {
                $lookup: {
                    from: 'services', // name of the collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            { $unwind: '$serviceDetails' },
            {
                $project: {
                    _id: '$serviceDetails._id',
                    name: '$serviceDetails.name',
                    price: '$serviceDetails.price',
                    images: '$serviceDetails.images',
                    description: '$serviceDetails.description',
                    duration: '$serviceDetails.duration',
                    count: 1
                }
            }
        ]);

        res.json(stats);
    })
];
// @desc    Get financial stats
// @route   GET /api/statistics/average-revenue-per-appointment
// @access  Private/Admin|Staff
const getAverageRevenuePerAppointment = [
    asyncHandler(async (req, res) => {
        const { startDate, endDate } = req.query;
        const startDateGte = startDate ? moment(startDate).startOf('day').toDate() : null;
        const endDateLte = endDate ? moment(endDate).endOf('day').toDate() : null;

        const dateFilter = {};
        if (startDateGte) dateFilter.$gte = startDateGte;
        if (endDateLte) dateFilter.$lte = endDateLte;

        const matchConditions = {
            paymentStatus: 'Paid',
            ...(startDateGte || endDateLte ? { date: dateFilter } : {})
        };

        const appointments = await Appointment.find(matchConditions);

        if (appointments.length === 0) {
            return res.json({ averageRevenuePerAppointment: 0 });
        }

        const totalRevenue = appointments.reduce((total, appointment) => total + appointment.totalPrice, 0);
        const totalActual = appointments.reduce((total, appointment) => total + appointment.actualPayment, 0);
        const averageRevenuePerAppointment = totalRevenue / appointments.length;
        const averageActualPerAppointment = totalActual / appointments.length;
        res.json({ averageActualPerAppointment, averageRevenuePerAppointment, percent: averageActualPerAppointment / averageRevenuePerAppointment * 100 });
    })
];

module.exports = {
    getFinancialStats,
    getRegistrationStats,
    getMostSelectedService,
    getAverageRevenuePerAppointment
};
