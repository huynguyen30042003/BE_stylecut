const asyncHandler = require('express-async-handler');
const { param, query, validationResult } = require('express-validator');
const Salon = require('../models/Salon');

// @desc    Search in all salon by keyword
// @route   GET /api/search
// @access  Public
const searchInAllSalon = [
    // Validate and sanitize inputs
    query('query').notEmpty().withMessage('Query is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { query } = req.query;

        // Find the salon by id
        const salons = await Salon.find({})
            .populate('services')
            .populate('combos')
            .populate('staffs')
            ;
        console.log(salons);
        if (!salons || salons.length == 0) {
            return res.status(404).json({ message: 'Salons not found' });
        }
        const result = salons.map(salon => {
            salon.services = salon.services.filter(service => service.name.toLowerCase().includes(query.toLowerCase()));
            salon.combos = salon.combos.filter(combo => combo.name.toLowerCase().includes(query.toLowerCase()));
            salon.staffs = salon.staffs.filter(staff => staff.name.toLowerCase().includes(query.toLowerCase()));
            return salon;
        })
        res.json(result);
    })
];


// @desc    Search within a salon by keyword
// @route   GET /api/search/:salonId
// @access  Public
const searchInSalon = [
    // Validate and sanitize inputs
    param('salonId').isMongoId().withMessage('Invalid salon ID'),
    query('query').notEmpty().withMessage('Query is required'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { salonId } = req.params;
        const { query } = req.query;

        // Find the salon by id
        const salon = await Salon.findById(salonId)
            .populate('services')
            .populate('combos')
            .populate('staffs');
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        // Search services, combos, and staffs within the salon
        salon.services = salon.services.filter(service => service.name.toLowerCase().includes(query.toLowerCase()));
        salon.combos = salon.combos.filter(combo => combo.name.toLowerCase().includes(query.toLowerCase()));
        salon.staffs = salon.staffs.filter(staff => staff.name.toLowerCase().includes(query.toLowerCase()));

        res.json(salon);
    })
];

module.exports = {
    searchInAllSalon,
    searchInSalon
};
