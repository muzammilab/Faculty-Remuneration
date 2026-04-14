// models/Faculty.js
const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    department: { type: String, required: true },
    role: { type: String, enum: ["faculty", "admin"], default: "faculty" },
    resetOTP: String,
    resetOTPExpiry: Date,
    resetOTPAttempts: { type: Number, default: 0 },
    travelAllowance: { type: Number, required: true },
    designation: {
      type: String,
      enum: [
        "HoD",
        "Professor",
        "Assistant Professor",
        "Associate Professor",
        "External Examiner",
      ],
      required: true,
    },

    // Grouped subject assignments per year + semesterType
    assignedSubjects: [
      {
        academicYear: { type: String, required: true }, // e.g. "2025-26"
        semesters: [
          {
            semesterType: {
              type: String,
              enum: ["Odd", "Even"],
              required: true,
            },
            subjects: [
              {
                _id: false,
                subjectId: mongoose.Schema.Types.ObjectId,
                name: { type: String, required: true },
                department: { type: String, required: true },
                semester: { type: Number, required: true },

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

                count: Number,
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Faculty", facultySchema);
