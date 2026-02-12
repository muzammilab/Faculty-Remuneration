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
    /* baseSalary: { type: Number, required: true }, */
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
                subjectId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Subject",
                },
                name: String,
                department: String, // NEW
                semester: Number,
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
