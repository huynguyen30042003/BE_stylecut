const express = require("express");
const {
  getFinancialStats,
  getRegistrationStats,
  getMostSelectedService,
  getAverageRevenuePerAppointment,
} = require("../controllers/statisticController");
const { includeOf, admin, protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get(
  "/financial-stats",
  protect,
  includeOf(["Admin", "Staff"]),
  getFinancialStats
);

router.get(
  "/registration-stats",
  protect,
  includeOf(["Admin", "Staff"]),
  getRegistrationStats
);
router.get(
  "/most-service",
  protect,
  includeOf(["Admin", "Staff"]),
  getMostSelectedService
);
router.get(
  "/average-revenue-per-appointment",
  protect,
  includeOf(["Admin", "Staff"]),
  getAverageRevenuePerAppointment
);
module.exports = router;
