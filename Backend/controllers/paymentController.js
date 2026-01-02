const Faculty = require("../models/faculty");
const Subject = require("../models/subjects");
const Payment = require("../models/payment");

// Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("facultyId", "name email department designation")
      .sort({ createdAt: -1 }); // Most recent first

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payment data" });
  }
};

// Fetching Single Payment
// **For For all academic years of a faculty**
// GET /admin/payment/getSinglePayment/:facultyId
// **For all subjects/semTypes of a faculty in a year**
// GET /admin/payment/getSinglePayment/:facultyId/:academicYear
// **For one subject of a faculty in a particular year and semType**
// GET /admin/payment/getSinglePayment/:facultyId/:subjectId/:academicYear
exports.getSinglePayment = async (req, res) => {
  try {
    const { facultyId, subjectId, academicYear } = req.params;

    const query = { facultyId };
    if (academicYear) query.academicYear = academicYear;
    // NOTE: Don't put semesterType in query; we want both Odd & Even for that year

    const payments = await Payment.find(query)
      .populate("facultyId", "name department baseSalary travelAllowance")
      .populate("subjectBreakdown.subjectId", "name semester")
      .lean();

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payment found" });
    }

    // Flatten all docs into one breakdown
    let breakdown = payments.flatMap((p) =>
      p.subjectBreakdown.map((item) => ({
        paymentId: p._id, // <- attached paymentId here
        subjectId: item.subjectId?._id?.toString?.() || item.subjectId,
        semester: item.subjectId?.semester ?? item.semester,
        subjectName: item.subjectId?.name ?? item.subjectName,
        subjectTotal: item.subjectTotal,
        academicYear: p.academicYear,
        semesterType: p.semesterType, // <- keeps Odd/Even
          department: item.department, // <-- NEW
        termTestAssessment: item.termTestAssessment,
        termWorkAssessment: item.termWorkAssessment,
        oralPracticalAssessment: item.oralPracticalAssessment,
        paperChecking: item.paperChecking,
      }))
    );

    // Optional subject filter
    if (subjectId) {
      breakdown = breakdown.filter((b) => b.subjectId === subjectId);
      if (breakdown.length === 0) {
        return res
          .status(404)
          .json({ message: "Subject not found in payment" });
      }
    }

    // Use first doc for faculty meta (all should be same faculty)
    const first = payments[0];

    res.json({
      facultyName: first.facultyId?.name,
      department: first.facultyId?.department,
      payments,
      breakdown, // <- both Odd & Even are here && if subjectId is present then breakdown returns only one subject remuneration.
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching payment details",
      error: err.message,
    });
  }
};

// Get all faculty members
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find(
      {},
      "name email department designation baseSalary travelAllowance assignedSubjects"
    );
    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Failed to fetch faculty data" });
  }
};

// Get faculty by ID with assigned subjects
// GET /admin/payment/faculty/:facultyId
exports.getFacultyById = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await Faculty.findById(facultyId);
    /* .populate('assignedSubjects.subjectId', 'name semester department'); */

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ error: "Failed to fetch faculty data" });
  }
};

// Get semesters for a specific faculty
// GET /admin/payment/faculty/:facultyId/semesters
// ✅ Get all year+semester combinations for faculty
exports.getFacultySemesters = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const semData = [];

    faculty.assignedSubjects.forEach((yearBlock) => {
      const academicYear = yearBlock.academicYear;

      yearBlock.semesters.forEach((semBlock) => {
        const semesterType = semBlock.semesterType;

        semBlock.subjects.forEach((subj) => {
          if (subj.semester) {
            semData.push({
              academicYear,
              semesterType,
              semester: subj.semester,
              label: `Sem ${subj.semester} - ${semesterType} - ${academicYear}`, // ✅ for dropdown
            });
          }
        });
      });
    });

    // Remove duplicates by label
    const uniqueSemesters = Array.from(
      new Map(semData.map((item) => [item.label, item])).values()
    );

    // Sort by academicYear then semester
    uniqueSemesters.sort((a, b) => {
      if (a.academicYear !== b.academicYear) {
        return a.academicYear.localeCompare(b.academicYear);
      }
      return a.semester - b.semester;
    });

    res.json(uniqueSemesters);
  } catch (error) {
    console.error("Error fetching faculty semesters:", error);
    res.status(500).json({ error: "Failed to fetch faculty semesters" });
  }
};

// Get subjects for a specific faculty in a specific semester
// GET /admin/payment/faculty/:facultyId/semester/:semester/year/:academicYear/semType/:semesterType/subjects
// ✅ Get faculty subjects by academicYear + semType + semester
exports.getFacultySubjectsBySemester = async (req, res) => {
  try {
    const { facultyId, academicYear, semesterType, semester } = req.params;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    // find correct year block
    const yearBlock = faculty.assignedSubjects.find(
      (y) => y.academicYear === academicYear
    );
    if (!yearBlock) {
      return res
        .status(404)
        .json({ error: "No subjects for this academic year" });
    }

    // find semester type block
    const semBlock = yearBlock.semesters.find(
      (s) => s.semesterType === semesterType
    );
    if (!semBlock) {
      return res
        .status(404)
        .json({ error: "No subjects for this semester type" });
    }

    // filter subjects for given semester
    const matchedSubjects = semBlock.subjects.filter(
      (subj) => subj.semester === parseInt(semester)
    );

    res.json(matchedSubjects);
  } catch (error) {
    console.error("Error fetching faculty subjects:", error);
    res.status(500).json({ error: "Failed to fetch faculty subjects" });
  }
};

// POST /admin/payment/create
exports.postCreate = async (req, res) => {
  try {
    const {
      facultyId,
      academicYear,
      semesterType,
      subjectBreakdown, // Contains subjectId + counts/rates
    } = req.body;

    // 1. Fetch faculty salary info
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });
    const facultyName = faculty.name; // store faculty name
    // const baseSalary = faculty.baseSalary || 0;
    const travelAllowance = faculty.travelAllowance || 0;

    let totalRemuneration = 0;
    const updatedSubjectBreakdown = [];

    // 2. Process each subject
    for (const subjectItem of subjectBreakdown) {
      const subject = await Subject.findById(subjectItem.subjectId);
      if (!subject) continue;

      let subjectTotal = 0;
      const updated = {
        subjectId: subject._id,
        subjectName: subjectItem.subjectName || subject.name,
        semester: subjectItem.semester || subject.semester,
        department: subjectItem.department || subject.department, // <-- NEW 
        termTestAssessment: { applicable: false, count: 0, rate: 0, amount: 0 },
        termWorkAssessment: { applicable: false, count: 0, rate: 0, amount: 0 },
        oralPracticalAssessment: { applicable: false, count: 0, rate: 0, amount: 0 },
        paperChecking: { applicable: false, count: 0, rate: 0, amount: 0 },
        subjectTotal: 0,
      };

      // 💠 Term Test
      if (subject.hasTermTest && faculty.designation !== "External Examiner") {
        const { count = 0, rate = 0 } = subjectItem.termTestAssessment || {};
        const amount = count * rate;
        updated.termTestAssessment = { applicable: true, count, rate, amount };
        subjectTotal += amount;
      }

      // 💠 Term Work
      if (subject.hasTermWork && faculty.designation !== "External Examiner") {
        const { count = 0, rate = 0 } = subjectItem.termWorkAssessment || {};
        const amount = count * rate;
        updated.termWorkAssessment = { applicable: true, count, rate, amount };
        subjectTotal += amount;
      }

      // 💠 Oral/Practical
      if (subject.hasPractical) {
        const { count = 0, rate = 0 } = subjectItem.oralPracticalAssessment || {};
        const amount = count * rate;
        updated.oralPracticalAssessment = { applicable: true, count, rate, amount };
        subjectTotal += amount;
      }

      // 💠 Paper Checking
      if ( subject.hasSemesterExam && faculty.designation !== "External Examiner" ) {
        const { count = 0, rate = 0 } = subjectItem.paperChecking || {};
        const amount = count * rate;
        updated.paperChecking = { applicable: true, count, rate, amount };
        subjectTotal += amount;
      }

      updated.subjectTotal = subjectTotal;
      updatedSubjectBreakdown.push(updated);
      totalRemuneration += subjectTotal;
    }

    // 3. Check if a payment record already exists for same faculty/year/semType

    console.log("Updated Subject Breakdown --> ",updatedSubjectBreakdown);

    let payment = await Payment.findOne({
      facultyId,
      academicYear,
      semesterType,
    });

    if (payment) {

      // NEW : 🚫 Check for duplicate subjects (same subjectId) 
      const existingSubjectIds = payment.subjectBreakdown.map(
        (s) => s.subjectId.toString()
      );
      
      const duplicateSubjects = updatedSubjectBreakdown.filter((s) =>
        existingSubjectIds.includes(s.subjectId.toString())
      );
      
      if (duplicateSubjects.length > 0) {
        return res.status(400).json({
          error: `From Backend: Subject already exists for this faculty, academic year and semester type`,
        });
      }

      // Append new subjects to subjectBreakdown
      payment.subjectBreakdown.push(...updatedSubjectBreakdown);

      // Recalculate totals
      payment.totalRemuneration = payment.subjectBreakdown.reduce(
        (sum, s) => sum + (s.subjectTotal || 0),
        0
      );

      payment.totalAmount = /* payment.baseSalary + */ payment.travelAllowance + payment.totalRemuneration;

      await payment.save();
      return res.status(200).json({ message: "Payment updated", payment });
    } else {
      // Create new payment doc
      const totalAmount = /* baseSalary + */ travelAllowance + totalRemuneration;
      payment = new Payment({
        facultyId,
        facultyName,
        academicYear,
        semesterType,
        // baseSalary,
        travelAllowance,
        subjectBreakdown: updatedSubjectBreakdown,
        totalRemuneration,
        totalAmount,
      });

      await payment.save();
      return res.status(201).json({ message: "Payment created", payment });
    }
  } catch (error) {
    console.error("Error calculating payment:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// controllers/paymentController.js
exports.putUpdate = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const {
      baseSalary,
      travelAllowance,
      subjectBreakdown, // updated subjects with counts & rates
    } = req.body;

    // 1. Find payment record
    let payment = await Payment.findById(paymentId).populate("facultyId");
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    // 2. Update base salary & allowance
    payment.baseSalary = baseSalary ?? payment.baseSalary;
    payment.travelAllowance = travelAllowance ?? payment.travelAllowance;

    let totalRemuneration = 0;
    const updatedSubjectBreakdown = [];

    // 3. Process subject breakdown again
    for (const subjectItem of subjectBreakdown) {
      const subject = await Subject.findById(subjectItem.subjectId);
      if (!subject) continue;

      let subjectTotal = 0;
      const updated = {
        subjectId: subject._id,
        subjectName: subjectItem.subjectName || subject.name,
        semester: subjectItem.semester || subject.semester,
        termTestAssessment: { applicable: false, count: 0, rate: 0, amount: 0 },
        oralPracticalAssessment: {
          applicable: false,
          count: 0,
          rate: 0,
          amount: 0,
        },
        paperChecking: { applicable: false, count: 0, rate: 0, amount: 0 },
        subjectTotal: 0,
      };

      // Term Test
      if (subject.hasTermTest) {
        const { count = 0, rate = 0 } = subjectItem.termTestAssessment || {};
        const amount = count * rate;
        updated.termTestAssessment = { applicable: true, count, rate, amount };
        subjectTotal += amount;
      }

      // Oral/Practical
      if (subject.hasPractical) {
        const { count = 0, rate = 0 } =
          subjectItem.oralPracticalAssessment || {};
        const amount = count * rate;
        updated.oralPracticalAssessment = {
          applicable: true,
          count,
          rate,
          amount,
        };
        subjectTotal += amount;
      }

      // Paper Checking
      if (subject.hasSemesterExam) {
        const { count = 0, rate = 0 } = subjectItem.paperChecking || {};
        const amount = count * rate;
        updated.paperChecking = { applicable: true, count, rate, amount };
        subjectTotal += amount;
      }

      updated.subjectTotal = subjectTotal;
      updatedSubjectBreakdown.push(updated);
      totalRemuneration += subjectTotal;
    }

    // 4. Replace old breakdown with updated
    payment.subjectBreakdown = updatedSubjectBreakdown;

    // 5. Recalculate totals
    payment.totalRemuneration = totalRemuneration;
    payment.totalAmount = payment.baseSalary + payment.travelAllowance + totalRemuneration;

    await payment.save();

    return res.status(200).json({
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
