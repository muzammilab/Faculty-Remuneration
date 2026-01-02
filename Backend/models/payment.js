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

    // baseSalary: { type: Number, default: 0 }, 
    travelAllowance: { type: Number, default: 0 },

    subjectBreakdown: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: String,
        department: String, // <-- NEW 
        semester: Number,
        termTestAssessment: {
          applicable: { type: Boolean, default: false },
          count: { type: Number, default: 0 },
          rate: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
        },
        termWorkAssessment: {
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
    totalAmount: { type: Number, default: 0 }, // Travel Allowance + Total Remuneration

    status: {
      type: String,
      enum: ["paid", "unpaid", "failed"],
      default: "unpaid",
    },

    paidAt: {
      type: Date, // <-- NEW
      default: null,
    },

    transactionId: String, // store mock/real payment gateway ID
    // paidDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
