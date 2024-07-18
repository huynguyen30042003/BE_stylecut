const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = [
    body('category').notEmpty().withMessage('Category is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { category, description, services, status } = req.body;

        const newCategory = new Category({
            category,
            description,
            services,
            status
        });

        const createdCategory = await newCategory.save();
        res.status(201).json(createdCategory);
    })
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = [
    asyncHandler(async (req, res) => {
        const categories = await Category.find({}).populate("services");
        res.json(categories);
    })
];

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = [
    param('id').isMongoId().withMessage('Invalid Category ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const category = await Category.findById(req.params.id).populate("services");
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    })
];

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = [
    param('id').isMongoId().withMessage('Invalid Category ID'),
    body('category').notEmpty().withMessage('Category is required'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { category, description, services, status } = req.body;

        const updatedCategory = await Category.findById(req.params.id);

        if (updatedCategory) {
            updateCategory.category = category || updateCategory.category;
            updateCategory.description = description || updateCategory.description;
            updateCategory.services = services || updateCategory.services;
            updateCategory.status = status || updateCategory.status;

            res.json(await updateCategory.save());
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    })
];

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = [
    param('id').isMongoId().withMessage('Invalid Category ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const category = await Category.findByIdAndDelete(req.params.id);
        if (category) {
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    })
];

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
