const express = require('express');
const {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} = require('../controllers/contactController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, admin, getContacts)
    .post(protect, createContact);

    
router.route('/:id')
    .get(protect, admin, getContactById)
    .put(protect, admin, updateContact)
    .delete(protect, admin, deleteContact);

module.exports = router;
