const express = require('express');
const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
} = require('../controllers/serviceController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, admin, createService)
    .get(getServices);

router.route('/:id')
    .get(getServiceById)
    .put(protect, admin, updateService)
    .delete(protect, admin, deleteService);

module.exports = router;
