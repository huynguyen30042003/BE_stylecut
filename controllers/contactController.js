const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');
const { body, validationResult, param } = require('express-validator');
const Account = require('../models/Account');

// @desc    Fetch all contacts
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = [
    asyncHandler(async (req, res) => {
        const contacts = await Contact.find({})
            .populate("customer", "_id name email phone avatar")
            .populate("staff", "_id name email phone avatar");
        res.json(contacts);
    })
];

// @desc    Fetch single contact
// @route   GET /api/contacts/:id
// @access  Private/Admin
const getContactById = [
    param('id').isMongoId().withMessage('Invalid Contact ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const contact = await Contact.findById(req.params.id)
            .populate("customer", "_id name email phone avatar")
            .populate("staff", "_id name email phone avatar");
        if (contact) {
            res.json(contact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    })
];

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Public
const createContact = [
    body('question').not().isEmpty().withMessage('Question is required'),
    body('answer').optional(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { question, answer, staff } = req.body;
        const contact = new Contact({
            question,
            answer,
            customer: req.user._id,
            staff
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    })
];

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private/Admin
const updateContact = [
    param('id').isMongoId().withMessage('Invalid Contact ID'),
    body('question').not().isEmpty().withMessage('Question is required'),
    body('answer').optional(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { answer, status } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (contact) {
            // contact.question = question || contact.question;
            contact.answer = answer || contact.answer;
            // contact.customer = customer || contact.customer;
            // contact.staff = staff || contact.staff; 
            contact.staff = req.user._id;
            contact.status = status || contact.status;

            const updatedContact = await contact.save();
            res.json(updatedContact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    })
];

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = [
    param('id').isMongoId().withMessage('Invalid Contact ID'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (contact) {
            res.json({ message: 'Contact removed' });
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    })
];

module.exports = {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
