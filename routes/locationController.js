const Location = require('../models/Location');
const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');

// @desc    Fetch all locations
// @route   GET /api/locations
// @access  Public
const getLocations = [
    asyncHandler(async (req, res) => {
        const locations = await Location.find({});
        res.json(locations);
    })
];

// @desc    Fetch single location
// @route   GET /api/locations/:id
// @access  Public
const getLocationById = [
    param('id').isMongoId().withMessage('Invalid Location ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const location = await Location.findById(req.params.id);
        if (location) {
            res.json(location);
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    })
];

// @desc    Create a location
// @route   POST /api/locations
// @access  Private/Admin
const createLocation = [
    body('number').not().isEmpty().withMessage('Number is required'),
    body('street').not().isEmpty().withMessage('Street is required'),
    body('ward').not().isEmpty().withMessage('Ward is required'),
    body('district').not().isEmpty().withMessage('District is required'),
    body('city').not().isEmpty().withMessage('City is required'),
    body('map').not().isEmpty().withMessage('Map location is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { number, street, ward, district, city, map, description } = req.body;

        const location = new Location({
            number,
            street,
            ward,
            district,
            city,
            map,
            description
        });

        const createdLocation = await location.save();
        res.status(201).json(createdLocation);
    })
];

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private/Admin
const updateLocation = [
    param('id').isMongoId().withMessage('Invalid Location ID'),
    body('number').not().isEmpty().withMessage('Number is required'),
    body('street').not().isEmpty().withMessage('Street is required'),
    body('ward').not().isEmpty().withMessage('Ward is required'),
    body('district').not().isEmpty().withMessage('District is required'),
    body('city').not().isEmpty().withMessage('City is required'),
    body('map').not().isEmpty().withMessage('Map location is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { number, street, ward, district, city, map, description } = req.body;

        const location = await Location.findById(req.params.id);

        if (location) {
            location.number = number || location.number;
            location.street = street || location.street;
            location.ward = ward || location.ward;
            location.district = district || location.district;
            location.city = city || location.city;
            location.map = map || location.map;
            location.description = description || location.description;

            const updatedLocation = await location.save();
            res.json(updatedLocation);
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    })
];

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private/Admin
const deleteLocation = [
    param('id').isMongoId().withMessage('Invalid Location ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const location = await Location.findByIdAndDelete(req.params.id);

        if (location) {
            res.json({ message: 'Location removed' });
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    })
];

module.exports = {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
};
