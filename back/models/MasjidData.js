const mongoose = require("mongoose");

const masjidDataSchema = new mongoose.Schema({
  masjidName: { type: String, required: true },
  year: { type: Number, required: true },

  mens: {
    houses:              { type: Number, default: 0 },
    total:               { type: Number, default: 0 },
    fourMonth_once:      { type: Number, default: 0 },
    fourMonth_moreThan2: { type: Number, default: 0 },
    berunSaathi:         { type: Number, default: 0 },
    fortyDaysSaathi:     { type: Number, default: 0 }
  },

  masturat: {
    berun:     { type: Number, default: 0 },
    fortyDays: { type: Number, default: 0 },
    tenDays:   { type: Number, default: 0 },
    threeDays: { type: Number, default: 0 }
  },

  students: {
    total: { type: Number, default: 0 }
  },

  talba: {
    total: { type: Number, default: 0 }
  },

  taalim: {
    taalim:   { type: Number, default: 0 },
    sixSifat: { type: Number, default: 0 }
  }

}, { timestamps: true });

// Unique per masjid + year
masjidDataSchema.index({ masjidName: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("MasjidData", masjidDataSchema);
