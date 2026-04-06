const MasjidData = require("../models/MasjidData");

const MASJID_LIST = [
  "Jumma Masjid", "Noorani Masjid", "Ayesha Masjid",
  "Fatima Masjid", "Bilal Masjid", "Medina Masjid",
  "Elaahi Masjid", "Bajipura", "Buhari"
];

// GET all masjid data for a year (creates defaults if not exist)
exports.getAllMasjidData = async (req, res) => {
  try {
    const year = Number(req.params.year);

    // Ensure all masjids have a record for this year
    const upsertOps = MASJID_LIST.map(masjidName => ({
      updateOne: {
        filter: { masjidName, year },
        update: { $setOnInsert: { masjidName, year } },
        upsert: true
      }
    }));
    await MasjidData.bulkWrite(upsertOps);

    const records = await MasjidData.find({ year }).sort({ masjidName: 1 });

    // Sort to match MASJID_LIST order
    const sorted = MASJID_LIST.map(name =>
      records.find(r => r.masjidName === name) || { masjidName: name, year }
    );

    // Compute Valod totals
    const valod = {
      mens: { houses: 0, total: 0, fourMonth_once: 0, fourMonth_moreThan2: 0, berunSaathi: 0, fortyDaysSaathi: 0 },
      masturat: { berun: 0, fortyDays: 0, tenDays: 0, threeDays: 0 },
      students: { total: 0 },
      talba: { total: 0 },
      taalim: { taalim: 0, sixSifat: 0 }
    };

    sorted.forEach(r => {
      if (!r.mens) return;
      valod.mens.houses              += r.mens.houses || 0;
      valod.mens.total               += r.mens.total || 0;
      valod.mens.fourMonth_once      += r.mens.fourMonth_once || 0;
      valod.mens.fourMonth_moreThan2 += r.mens.fourMonth_moreThan2 || 0;
      valod.mens.berunSaathi         += r.mens.berunSaathi || 0;
      valod.mens.fortyDaysSaathi     += r.mens.fortyDaysSaathi || 0;

      valod.masturat.berun     += r.masturat?.berun || 0;
      valod.masturat.fortyDays += r.masturat?.fortyDays || 0;
      valod.masturat.tenDays   += r.masturat?.tenDays || 0;
      valod.masturat.threeDays += r.masturat?.threeDays || 0;

      valod.students.total += r.students?.total || 0;
      valod.talba.total    += r.talba?.total || 0;

      valod.taalim.taalim   += r.taalim?.taalim || 0;
      valod.taalim.sixSifat += r.taalim?.sixSifat || 0;
    });

    res.json({ valod, masjids: sorted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single masjid data for a year
exports.getMasjidData = async (req, res) => {
  try {
    const { masjidName, year } = req.params;
    let record = await MasjidData.findOne({ masjidName, year: Number(year) });
    if (!record) {
      record = await MasjidData.create({ masjidName, year: Number(year) });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPSERT (create or update) masjid data
exports.upsertMasjidData = async (req, res) => {
  try {
    const { masjidName, year } = req.params;
    const record = await MasjidData.findOneAndUpdate(
      { masjidName, year: Number(year) },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
