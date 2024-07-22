const express = require('express');
const {
    createSalon,
    getSalons,
    getSalonById,
    updateSalon,
    deleteSalon
} = require('../controllers/salonController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, admin, createSalon)
    .get(getSalons);

    
router.route('/:id')
    .get(getSalonById)
    .put(protect, admin, updateSalon)
    .delete(protect, admin, deleteSalon);

module.exports = router;
