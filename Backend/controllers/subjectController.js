
const Subject = require("../models/subjects");

// Fetch all Subjects with optional filters
exports.getSubjects = async (req, res) => {
  try {

    // Filter by semester and/or department
    const filters = {};

    if (req.query.semester) {
      filters.semester = Number(req.query.semester);
    }

    if (req.query.department) {
      filters.department = req.query.department;
    }

    const subjects = await Subject.find(filters).sort({ semester: 1, name: 1 });
    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

// Fetch Subject details by Subject ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.json(subject);
  } catch (err) {
    console.error("Error fetching subject by ID:", err);
    res.status(500).json({ error: "Failed to fetch subject" });
  }
};

exports.postCreate = async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create subject", details: err.message });
  }
};

exports.putUpdate = async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Subject not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update subject" });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete subject" });
  }
};

// POST /api/admin/subjects/bulk
exports.createBulk = async (req, res) => {
  try {
    const subjectsArray = req.body; // Expecting an array of subjects

    if (!Array.isArray(subjectsArray) || subjectsArray.length === 0) {
      return res
        .status(400)
        .json({ error: "Please provide an array of subjects" });
    }

    const createdSubjects = await Subject.insertMany(subjectsArray);
    res.status(201).json({
      message: `${createdSubjects.length} subjects created`,
      data: createdSubjects,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create subjects", details: err.message });
  }
};
