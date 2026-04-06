const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllMasjidData,
  getMasjidData,
  upsertMasjidData
} = require("../controllers/masjidDataController");

// Public - get all masjid data for a year (includes valod totals)
router.get("/:year", getAllMasjidData);

// Public - get single masjid
router.get("/:year/:masjidName", getMasjidData);

// Admin - upsert (create/update) a masjid record
router.put("/:year/:masjidName", authMiddleware, upsertMasjidData);

module.exports = router;
