const Jammat = require("../models/Jammat");
const generatePDF = require("../utils/exportPdf");

exports.createJammat = async (req, res) => {
  try {
    const newJammat = new Jammat(req.body);

    const savedJammat = await newJammat.save();

    res.status(201).json(savedJammat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJammatByYear = async (req, res) => {
  try {
    const year = req.params.year;

    const jammats = await Jammat.find({ year });

    res.json(jammats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJammatByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;

    const jammats = await Jammat.find({ year, month }).sort({ startDate: 1 });

    res.json(jammats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require("mongoose");

exports.getJammatById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Jammat ID" });
    }

    const jammat = await Jammat.findById(id);

    if (!jammat) {
      return res.status(404).json({ message: "Jammat not found" });
    }

    res.json(jammat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateJammat = async (req, res) => {
  try {
    const updated = await Jammat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJammat = async (req, res) => {
  try {
    await Jammat.findByIdAndDelete(req.params.id);

    res.json({ message: "Jammat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMember = async (req, res) => {
  try {
    const { name, year, month, category, type, masjid } = req.query;

    let filter = {
     "members.names": { $regex: name, $options: "i" }
    };

    if (year) filter.year = Number(year);
    if (month) filter.month = month;
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (masjid) filter.masjidName = masjid;

    const results = await Jammat.find(filter).sort({ startDate: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.filterJammats = async (req, res) => {
  try {

    const { type, category, year, isRamzan, month, masjidName } = req.query;

    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (year) filter.year = Number(year);
    if (month) filter.month = month;
    if (masjidName) filter.masjidName = masjidName;
    if (isRamzan) filter.isRamzan = isRamzan === "true";

    const jammats = await Jammat.find(filter).sort({ startDate: -1 });

    res.json(jammats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getYearStatistics = async (req, res) => {
  try {

    const year = Number(req.params.year);

    const jammats = await Jammat.find({ year });

   const mens = {
  "3days": 0,
  "10days": 0,
  "40days": 0,
  "4months": 0
};

const masturat = {
  "3days": 0,
  "10days": 0,
  "40days": 0,
  "4months": 0
};

    let mensRamzan = 0;
    let masturatRamzan = 0;

    let totalMembers = 0;

    jammats.forEach(j => {

      // count members
      j.members.forEach(group => {
        totalMembers += group.names.length;
      });

      // MEN JAMMAT
      if (j.category?.toLowerCase() === "men") {

        mens[j.type] = (mens[j.type] || 0) + 1;

        if (j.isRamzan) mensRamzan++;

      }

      // WOMEN JAMMAT
      if (j.category?.toLowerCase() === "masturat") {

        masturat[j.type] = (masturat[j.type] || 0) + 1;

        if (j.isRamzan) masturatRamzan++;

      }

    });

    res.json({

      year,

      mens: {
        typeStats: mens,
        ramzan: mensRamzan
      },

      masturat: {
        typeStats: masturat,
        ramzan: masturatRamzan
      },

      summary: {

        "3days": (mens["3days"] || 0) + (masturat["3days"] || 0),
        "10days": (mens["10days"] || 0) + (masturat["10days"] || 0),
        "40days": (mens["40days"] || 0) + (masturat["40days"] || 0),
        "4months": (mens["4months"] || 0) + (masturat["4months"] || 0)

      },

      totalMembers

    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

exports.exportJammatPDF = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const jammats = await Jammat.find({ year }).sort({ startDate: 1 });

    generatePDF(jammats, res, year);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMonthStatistics = async (req, res) => {
  try {

    const { year, month } = req.params;

    const jammats = await Jammat.find({
      year: Number(year),
      month
    });

    const mens = {
      "3days": 0,
      "10days": 0,
      "40days": 0,
      "4months": 0
    };

    const masturat = {
      "3days": 0,
      "10days": 0,
      "40days": 0,
      "4months": 0
    };

    let mensRamzan = 0;
    let masturatRamzan = 0;

    jammats.forEach(j => {

      const type = j.type?.toLowerCase();

      if (j.category?.toLowerCase() === "men") {

        if (mens[type] !== undefined) {
          mens[type]++;
        }

        if (j.isRamzan) mensRamzan++;

      }

      if (j.category?.toLowerCase() === "masturat") {

        if (masturat[type] !== undefined) {
          masturat[type]++;
        }

        if (j.isRamzan) masturatRamzan++;

      }

    });

    res.json({

      mens: {
        typeStats: mens,
        ramzan: mensRamzan
      },

      masturat: {
        typeStats: masturat,
        ramzan: masturatRamzan
      },

      summary: {

        "3days": mens["3days"] + masturat["3days"],
        "10days": mens["10days"] + masturat["10days"],
        "40days": mens["40days"] + masturat["40days"],
        "4months": mens["4months"] + masturat["4months"]

      }

    });

  } catch (err) {

    res.status(500).json({ message: err.message });

  }
};

exports.getAllJammats = async (req, res) => {
  try {

    const { year, month, masjidName, type } = req.query;

    let query = {};

    if (year) query.year = Number(year);
    if (month) query.month = month;
    if (masjidName) query.masjidName = masjidName;
    if (type) query.type = type;

    const jammats = await Jammat.find(query).sort({ startDate: -1 });

    res.json(jammats);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMasjidStats = async (req, res) => {
  try {
    const { year } = req.params;

    const stats = await Jammat.aggregate([

      {
        $match: {
          year: Number(year),
          masjidName: { $nin: ["", null] } // optional but recommended
        }
      },

      {
        $addFields: {
          totalPeople: {
            $sum: {
              $map: {
                input: { $ifNull: ["$members", []] },
                as: "m",
                in: { $size: { $ifNull: ["$$m.names", []] } }
              }
            }
          }
        }
      },

      {
        $group: {
          _id: "$masjidName",   // ✅ THIS IS THE FIX
          totalJammats: { $sum: 1 },
          totalPeople: { $sum: "$totalPeople" }
        }
      },

      {
        $project: {
          masjid: "$_id",
          totalJammats: 1,
          totalPeople: 1,
          _id: 0
        }
      },

      {
        $sort: { totalJammats: -1 }
      }

    ]);

    console.log("🔥 FIXED MASJID STATS RUNNING");

    res.json(stats);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRamzanMasjidStats = async (req, res) => {
  try {
    const { year } = req.params;

    const stats = await Jammat.aggregate([

      {
        $match: {
          year: Number(year),
          isRamzan: true   // ✅ FILTER
        }
      },

      {
        $addFields: {
          totalPeople: {
            $sum: {
              $map: {
                input: { $ifNull: ["$members", []] },
                as: "m",
                in: { $size: { $ifNull: ["$$m.names", []] } }
              }
            }
          }
        }
      },

      {
        $group: {
          _id: "$masjidName",
          totalJammats: { $sum: 1 },
          totalPeople: { $sum: "$totalPeople" }
        }
      },

      {
        $project: {
          masjid: "$_id",
          totalJammats: 1,
          totalPeople: 1,
          _id: 0
        }
      },

      {
        $sort: { totalJammats: -1 }
      }

    ]);

    res.json(stats);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.fixMasjidData = async (req, res) => {
  try {
    const result = await Jammat.updateMany(
      { masjidName: { $type: "object" } },
      {
        $set: { masjidName: "Unknown Masjid" }
      }
    );

    res.json({ message: "Fixed", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};