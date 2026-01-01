// models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: Number, required: true },
  department: { type: String, required: true },

  // Assessment flags
  hasTermWork: { type: Boolean, default: true },
  hasPractical: { type: Boolean, default: false },
  hasTermTest: { type: Boolean, default: false },
  hasSemesterExam: { type: Boolean, default: true },
});

module.exports = mongoose.model("Subject", subjectSchema);
