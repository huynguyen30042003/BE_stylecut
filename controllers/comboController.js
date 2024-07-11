const Combo = require('../models/Combo');
const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');

// @desc    Create a new combo
// @route   POST /api/combos
// @access  Private/Admin
const createCombo = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    body('services').notEmpty().withMessage('Services are required').isArray({ min: 1 }).withMessage('At least one service is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, price, images, services, description, status } = req.body;

        const combo = new Combo({
            name,
            price,
            images,
            services,
            description,
            status
        });

        const createdCombo = await combo.save();
        res.status(201).json(createdCombo);
    })
];

// @desc    Get all combos
// @route   GET /api/combos
// @access  Public
const getCombos = [
    asyncHandler(async (req, res) => {
        const combos = await Combo.find({}).populate('services');
        res.json(combos);
    })
];

// @desc    Get a single combo by ID
// @route   GET /api/combos/:id
// @access  Public
const getComboById = [
    param('id').isMongoId().withMessage('Invalid Combo ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const combo = await Combo.findById(req.params.id)
            .populate('services');
        if (combo) {
            res.json(combo);
        } else {
            res.status(404).json({ message: 'Combo not found' });
        }
    })
];

// @desc    Update a combo
// @route   PUT /api/combos/:id
// @access  Private/Admin
const updateCombo = [
    param('id').isMongoId().withMessage('Invalid Combo ID'),
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    body('services').notEmpty().withMessage('Services are required').isArray({ min: 1 }).withMessage('At least one service is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, price, images, services, description, status } = req.body;

        const combo = await Combo.findById(req.params.id);

        if (combo) {
            combo.name = name || combo.name;
            combo.price = price || combo.price;
            combo.images = images || combo.images;
            combo.services = services || combo.services;
            combo.description = description || combo.description;
            combo.status = status || combo.status;

            const updatedCombo = await combo.save();
            res.json(updatedCombo);
        } else {
            res.status(404).json({ message: 'Combo not found' });
        }
    })
];

// @desc    Delete a combo
// @route   DELETE /api/combos/:id
// @access  Private/Admin
const deleteCombo = [
    param('id').isMongoId().withMessage('Invalid Category ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const combo = await Combo.findByIdAndDelete(req.params.id);
        if (combo) {
            res.json({ message: 'Combo removed' });
        } else {
            res.status(404).json({ message: 'Combo not found' });
        }
    })
];

module.exports = {
    createCombo,
    getCombos,
    getComboById,
    updateCombo,
    deleteCombo
};
