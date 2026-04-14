const Enrollment = require("../models/enrollmentRecord");

// Create new enrollment record
// POST /admin/enrollment/create
exports.createEnrollment = async (req, res) => {
  try {
    const saved = await Enrollment.create(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({
      error: "Failed to save",
      details: err.message,
    });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const data = await Enrollment.find().sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch",
    });
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update",
    });
  }
};

// GET subjects from enrollment record based on ay, sem, branch, semesterNumber
exports.getSubjectsFromEnrollment = async (req, res) => {
  try {
    const { ay, sem, branch, semesterNumber } = req.query;

    const record = await Enrollment.findOne({
      ay,
      sem,
      branch,
      semesterNumber: Number(semesterNumber),
    });

    if (!record) {
      return res.json([]);
    }

    const subjects = record.subjects.map((sub) => ({
      subjectId: sub.subjectId,
      name: sub.name,
      semester: sub.semester,
      department: sub.department,

      hasTermWork: sub.hasTermWork,
      termWorkMarks: sub.termWorkMarks,

      hasOral: sub.hasOral,
      oralMarks: sub.oralMarks,

      hasPractical: sub.hasPractical,
      practicalMarks: sub.practicalMarks,

      hasTermTest: sub.hasTermTest,
      termTestMarks: sub.termTestMarks,

      hasSemesterExam: sub.hasSemesterExam,
      semesterExamMarks: sub.semesterExamMarks,

      count: sub.count || 0,
    }));

    res.json(subjects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
};
