const express = require('express');
const {
    getRevenueStatistics,
    getProfitStatistics,
    getFinancialReport,
    getRevenueStatisticsInSalon,
    getProfitStatisticsInSalon,
    getFinancialReportInSalon
} = require('../controllers/statisticController');
const { includeOf, admin, protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/revenue', protect, admin, getRevenueStatistics);
router.get('/profit', protect, admin, getProfitStatistics);
router.get('/financial-report', protect, admin, getFinancialReport);

router.get('/revenue/:salonId', protect, admin, getRevenueStatisticsInSalon);
router.get('/profit/:salonId', protect, admin, getProfitStatisticsInSalon);
router.get('/financial-report/:salonId', protect, admin, getFinancialReportInSalon);

module.exports = router;
