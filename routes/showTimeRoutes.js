const express = require('express');
const {
    createShowTime,
    getShowTimes,
    getShowTimeById,
    updateShowTime,
    deleteShowTime
} = require('../controllers/showTimeController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, admin, createShowTime)
    .get(getShowTimes);

    
router.route('/:id')
    .get(getShowTimeById)
    .put(protect, admin, updateShowTime)
    .delete(protect, admin, deleteShowTime);

module.exports = router;
