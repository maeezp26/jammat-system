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
  getMonthStatistics,
  getMasjidStats
} = require("../controllers/jammatController");

// Create
router.post("/", authMiddleware, createJammat);

// Read
router.get("/year/:year", getJammatByYear);
router.get("/month/:year/:month", getJammatByMonth);
router.get("/search/member", searchMember);
router.get("/filter", filterJammats);
router.get("/statistics/:year", getYearStatistics);
router.get("/statistics/:year/:month", getMonthStatistics);
router.get("/masjid-stats/:year", getMasjidStats); // ✅ FIXED

// Export
router.get("/export/pdf/:year", exportJammatPDF);

// Single
router.get("/:id", getJammatById);

// Update
router.put("/:id", authMiddleware, updateJammat);

// Delete
router.delete("/:id", authMiddleware, deleteJammat);

module.exports = router;