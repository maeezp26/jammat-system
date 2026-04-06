
const mongoose = require("mongoose");

const memberGroupSchema = new mongoose.Schema({
  masjid: {
    type: String,
    required: true
  },
  names: [
    {
      type: String
    }
  ]
});

const jammatSchema = new mongoose.Schema({

  year: {
    type: Number,
    required: true
  },

  month: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["men", "masturat"],
    required: true
  },

  jammatNo: {
    type: Number,
    required: true
  },

  type: {
    type: String,
    enum: ["3days", "10days", "40days", "2months", "4months"],
    required: true
  },

  masjidName: {
    type: String,
    required: true
  },

  route: [
    {
      type: String
    }
  ],

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  saathi: {
    type: Number
  },

  isRamzan: {
    type: Boolean,
    default: false
  },
  
  ameer: {
  type: String,
  required: true
},

  note: {
    type: String
  },

  members: [memberGroupSchema]

},
{ timestamps: true });

module.exports = mongoose.model("Jammat", jammatSchema);