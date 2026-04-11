// models/RateConfig.js
const mongoose = require("mongoose");

const rateListSchema = new mongoose.Schema(
  {
    termWork: {
      "25": { type: Number, default: 6 },
      "50": { type: Number, default: 10 },
    },

    oral: {
      "25": {
        internal: { type: Number, default: 6 },
        external: { type: Number, default: 6 },
      },
      "50": {
        internal: { type: Number, default: 10 },
        external: { type: Number, default: 10 },
      },
    },

    oralWithPractical: {
      "25": {
        internal: { type: Number, default: 10 },
        external: { type: Number, default: 10 },
      },
      "50": {
        internal: { type: Number, default: 20 },
        external: { type: Number, default: 20 },
      },
    },

     termTest: {
      "20": { type: Number, default: 8 },
    },

    semester: {
  assessment: {
    "100": { type: Number, default: 16 },
    "80": { type: Number, default: 16 },
    "60": { type: Number, default: 8 },
    "50": { type: Number, default: 8 },
    "40": { type: Number, default: 8 },
  },
  moderation: {
    "100": { type: Number, default: 20 },
    "80": { type: Number, default: 20 },
    "60": { type: Number, default: 10 },
    "50": { type: Number, default: 10 },
    "40": { type: Number, default: 10 },
  },
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("RateList", rateListSchema);