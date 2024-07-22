const express = require('express');
const {
    createCombo,
    getCombos,
    getComboById,
    updateCombo,
    deleteCombo
} = require('../controllers/comboController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, admin, createCombo)
    .get(getCombos);

router.route('/:id')
    .get(getComboById)
    .put(protect, admin, updateCombo)
    .delete(protect, admin, deleteCombo);

module.exports = router;
