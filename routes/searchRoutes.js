const express = require('express');
const { searchInAllSalon, searchInSalon } = require('../controllers/searchController');
const router = express.Router();

router.get('/', searchInAllSalon);
router.get('/:salonId', searchInSalon);

module.exports = router;
