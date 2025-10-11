// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    facultyName: { type: String }, // ✅ ADDed this

    academicYear: { type: String, required: true }, // e.g. "2025-26"
    semesterType: { type: String, enum: ["Odd", "Even"], required: true },

    baseSalary: { type: Number, default: 0 }, 
    travelAllowance: { type: Number, default: 0 },

    subjectBreakdown: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: String,
        semester: Number,
        termTestAssessment: {
          applicable: { type: Boolean, default: false },
          count: { type: Number, default: 0 },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },
        oralPracticalAssessment: {
          applicable: { type: Boolean, default: false },
          count: { type: Number, default: 0 },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },
        paperChecking: {
          applicable: { type: Boolean, default: false },
          count: { type: Number, default: 0 },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },
        subjectTotal: { type: Number, default: 0 },
      },
    ],

    totalRemuneration: { type: Number, default: 0 }, // Total remuneration of all selected subjects
    totalAmount: { type: Number, default: 0 }, // baseSalary + TA + totalRemuneration

    status: {
      type: String,
      enum: ["paid", "unpaid", "failed"],
      default: "unpaid",
    },
    transactionId: String, // store mock/real payment gateway ID
    paidDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);

/*
const paymentSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    semester: { type: Number, required: true },
    academicYear: { type: String, required: true }, // e.g., "2024–25"

    // Copied from Faculty model at generation time
    baseSalary: { type: Number, required: true },

    subjectBreakdown: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },

        termTestAssessment: {
          applicable: { type: Boolean, default: false },
          count: { type: Number, default: 0 },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },

        oralPracticalAssessment: {
          applicable: { type: Boolean, default: false },
          count: { type: Number, default: 0 },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },

        paperChecking: {
          applicable: { type: Boolean, default: false },
          count: { type: Number, default: 0 },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },

        subjectTotal: { type: Number, default: 0 },
      },
    ],

    travelAllowance: { type: Number, default: 0 },

    // ✅ Sum of duties only (from subjectBreakdown)
    totalRemuneration: { type: Number, required: true },

    // ✅ Sum of baseSalary + travelAllowance + totalRemuneration
    totalAmount: { type: Number, required: true },

    status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    paidDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
 */
