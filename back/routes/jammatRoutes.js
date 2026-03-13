const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createJammat,
  getJammatByYear,
  getJammatByMonth,
  getJammatById,
  updateJammat,
   deleteJammat,
  searchMember,
  filterJammats,
  getYearStatistics,
  exportJammatPDF,
  getMonthStatistics
} = require("../controllers/jammatController");

// Create new jammat
router.post("/", authMiddleware, createJammat);

// Get jammats by year
router.get("/year/:year", getJammatByYear);

// Get jammats by month
router.get("/month/:year/:month", getJammatByMonth);

router.get("/search/member", searchMember);

router.get("/filter", filterJammats);

router.get("/statistics/:year", getYearStatistics);

router.get("/export/pdf/:year", exportJammatPDF);

router.get("/statistics/:year/:month", getMonthStatistics);

// Get single jammat detail
router.get("/:id", getJammatById);

// Update jammat
router.put("/:id", authMiddleware, updateJammat);

// Delete jammat
router.delete("/:id", authMiddleware, deleteJammat);

module.exports = router;