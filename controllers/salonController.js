const Salon = require('../models/Salon');
const Review = require('../models/Review');

const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');

// @desc    Create a new salon
// @route   POST /api/salons
// @access  Private/Admin
const createSalon = [
    
    body('name').not().isEmpty().withMessage('Name is required'),
    body('location').isMongoId().withMessage('Location must be a valid ObjectId'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, logo, description, staffs, services, combos, location, images } = req.body;

        const salon = new Salon({
            name,
            logo,
            description,
            staffs,
            services,
            combos,
            location,
            images
        });

        const createdSalon = await salon.save();
        res.status(201).json(createdSalon);
    })
];

// @desc    Get all salons
// @route   GET /api/salons
// @access  Public
const getSalons = [
    asyncHandler(async (req, res) => {
        const salons = await Salon.find({})
            .populate("reviews location combos services staffs")
        // .populate('location')
        // .populate('combos')
        // .populate('services')
        // .populate('staffs');

        res.json(salons);
    })
];

// @desc    Get a single salon by ID
// @route   GET /api/salons/:id
// @access  Public
const getSalonById = [
    param('id').isMongoId().withMessage('Invalid Salon ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salon = await Salon.findById(req.params.id)
            .populate("reviews location combos services staffs");
        if (salon) {
            salon.reviews = await Promise.all(salon.reviews.map(async (review) => {
                return await new Review(review).populateCustomer()
            }));
            res.json(salon);
        } else {
            res.status(404).json({ message: 'Salon not found' });
        }
    })
];


// @desc    Update a salon
// @route   PUT /api/salons/:id
// @access  Private/Admin
const updateSalon = [
    param('id').isMongoId().withMessage('Invalid Salon ID'),
    body('name').not().isEmpty().withMessage('Name is required'),
    body('location').isMongoId().withMessage('Location must be a valid ObjectId'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, logo, description, staffs, services, combos, location, images, reviews, status } = req.body;

        const salon = await Salon.findById(req.params.id);

        if (salon) {
            salon.name = name || salon.name;
            salon.logo = logo || salon.logo;
            salon.description = description || salon.description;
            salon.staffs = staffs || salon.staffs;
            salon.services = services || salon.services;
            salon.combos = combos || salon.combos;
            salon.location = location || salon.location;
            salon.images = images || salon.images;
            salon.reviews = reviews || salon.reviews;
            salon.status = status || salon.status;

            const updatedSalon = await salon.save();
            res.json(updatedSalon);
        } else {
            res.status(404).json({ message: 'Salon not found' });

        }
    })
];

// @desc    Delete a salon
// @route   DELETE /api/salons/:id
// @access  Private/Admin
const deleteSalon = [
    param('id').isMongoId().withMessage('Invalid Salon ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } s
        const salon = await Salon.findById(req.params.id);
        if (salon) {
            await salon.remove();
            res.json({ message: 'Salon removed' });
        } else {
            res.status(404).json({ message: 'Salon not found' });
        }
    })
];

module.exports = {
    createSalon,
    getSalons,
    getSalonById,
    updateSalon,
    deleteSalon
};
