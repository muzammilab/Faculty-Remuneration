const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
{
  ay: { type: String, required: true },
  year: { type: String, required: true },
  sem: { type: String, required: true },
  semesterNumber: { type: Number, required: true },
  branch: { type: String, required: true },

  subjects: [
    {
      subjectId: mongoose.Schema.Types.ObjectId,

      name: String,
      semester: Number,
      department: String,

      hasTermWork: Boolean,
      termWorkMarks: Number,

      hasOral: Boolean,
      oralMarks: Number,

      hasPractical: Boolean,
      practicalMarks: Number,

      hasTermTest: Boolean,
      termTestMarks: Number,

      hasSemesterExam: Boolean,
      semesterExamMarks: Number,

      count: Number
    }
  ]
},
{ timestamps: true }
);

module.exports = mongoose.model("EnrollmentRecord", enrollmentSchema);