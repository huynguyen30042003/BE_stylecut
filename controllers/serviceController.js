const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');
const Review = require('../models/Review');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = [
    
    body('name').not().isEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, price, images, description, duration } = req.body;

        const service = new Service({
            name,
            price,
            images,
            description,
            duration
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    })
];

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = [
    asyncHandler(async (req, res) => {
        const services = await Service.find({}).populate("reviews");
        res.json(services);
    })
];

// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = [
    param('id').isMongoId().withMessage('Invalid Category ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const service = await Service.findById(req.params.id).populate("reviews");
        if (service) {
            service.reviews = await Promise.all(service.reviews.map(async (review) => {
                return await new Review(review).populateCustomer()
            }));
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    })
];

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = [
    param('id').isMongoId().withMessage('Invalid Service ID'),
    body('name').not().isEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, price, images, description, duration, reviews, status } = req.body;

        const service = await Service.findById(req.params.id);

        if (service) {
            service.name = name || service.name;
            service.price = price || service.price;
            service.images = images || service.images;
            service.description = description || service.description;
            service.duration = duration || service.duration;
            service.reviews = reviews || service.reviews;
            service.status = status || service.status;

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    })
];

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = [
    param('id').isMongoId().withMessage('Invalid Service ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const service = await Service.findByIdAndDelete(req.params.id);
        if (service) {
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    })
];

module.exports = {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
};
