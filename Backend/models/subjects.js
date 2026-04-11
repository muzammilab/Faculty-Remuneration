// models/Subject.js
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  semester: { type: Number, required: true },
  department: { type: String, required: true },

  // Assessment Flag's
  hasTermWork: { type: Boolean, default: true },
  termWorkMarks: { type: Number, default: 0 }, // NEW

  hasOral: { type: Boolean, default: false }, // NEW
  oralMarks: { type: Number, default: 0 }, // NEW

  hasPractical: { type: Boolean, default: false },
  practicalMarks: { type: Number, default: 0 }, // NEW

  hasTermTest: { type: Boolean, default: false },
  termTestMarks: { type: Number, default: 0 }, // NEW

  hasSemesterExam: { type: Boolean, default: true },
  semesterExamMarks: { type: Number, default: 0 }, // NEW
});

module.exports = mongoose.model("Subject", subjectSchema);
