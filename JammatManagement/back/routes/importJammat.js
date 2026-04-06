import express from "express";
import Jammat from "../models/Jammat.js";

const router = express.Router();

router.post("/import-jammats", async (req, res) => {
  try {

    const data = req.body;   // array of jammat objects

    const result = await Jammat.insertMany(data);

    res.json({
      message: "Jammats imported successfully",
      inserted: result.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Import failed" });
  }
});

export default router;