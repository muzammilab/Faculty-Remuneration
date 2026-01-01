const Faculty = require("../models/faculty");
const Subject = require("../models/subjects");
const bcrypt = require("bcryptjs");

// POST /admin/faculty/add
exports.addFaculty = async (req, res) => {
  try {
    const academicAssignments = req.body.academicAssignments;

    // mapping nested structure properly to fetch subject id from mongoDb
    const assignedSubjects = await Promise.all(
      academicAssignments.map(async (yearBlock) => {
        const semesters = await Promise.all(
          yearBlock.semesters.map(async (semBlock) => {
            const subjects = await Promise.all(
              semBlock.subjects.map(async (subj) => {
                const subjectDoc = await Subject.findOne({
                  name: subj.name,
                  semester: subj.semester,
                  department: subj.department,
                });

                if (!subjectDoc) {
                  throw new Error(
                    `Subject not found: ${subj.name} (Semester ${subj.semester})`
                  );
                }

                return {
                  subjectId: subjectDoc._id,
                  name: subj.name,
                  department: subj.department,
                  semester: subj.semester,
                };
              })
            );

            return {
              semesterType: semBlock.semesterType,
              subjects,
            };
          })
        );

        return {
          academicYear: yearBlock.academicYear,
          semesters,
        };
      })
    );
    const email = req.body.email;
    const Isexist = await Faculty.findOne({ email });
    if (Isexist) {
      return res
        .status(403)
        .json({ message: "A faculty with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const faculty = new Faculty({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      department: req.body.department,
      role: req.body.role || "faculty",
      /* baseSalary: req.body.baseSalary, */
      travelAllowance: req.body.travelAllowance,
      designation: req.body.designation,
      assignedSubjects, // now matches schema
    });

    await faculty.save();
    res.status(201).json(faculty);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Faculty creation failed", details: err.message });
  }
};


// PUT /admin/faculty/:id/update
exports.updateAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const { academicYear, semesterType, subjects } = req.body;

    const faculty = await Faculty.findById(id);
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    // Resolve subjectId from DB using name + semester 
    const resolvedSubjects = await Promise.all(
      subjects.map(async (subj) => {
        console.log("Searching for subject: ", subj);
        const found = await Subject.findOne({
          name: subj.name,
          semester: subj.semester,
          department: subj.branch,
        });

        if (!found) {
          return res.status(400).json({
            error: `Subject not found: ${subj.name} -- Branch ${subj.branch} (Semester ${subj.semester})`,
          });
        }

        console.log(found);

        return {
          subjectId: found._id,
          name: found.name,
          semester: found.semester,
          department: found.department,
        };
      })
    );

    // Now update assignments with resolved subjectIds
    let yearBlock = faculty.assignedSubjects.find(
      (a) => a.academicYear === academicYear
    );

    if (yearBlock) {
      let semBlock = yearBlock.semesters.find(
        (s) => s.semesterType === semesterType
      );
      if (semBlock) {
        semBlock.subjects.push(...resolvedSubjects); // same year + semType → add subjects
      } else {
        yearBlock.semesters.push({ semesterType, subjects: resolvedSubjects }); // same year, new sem
      }
    } else {
      faculty.assignedSubjects.push({
        academicYear,
        semesters: [{ semesterType, subjects: resolvedSubjects }],
      }); // new year 
    }

    await faculty.save();
    res.status(200).json({ message: "Assignments updated", faculty });
  } catch (err) {
    console.error("Error updating assignments:", err.message);
    res.status(500).json({ error: err.message, details: err.message });
  }
};


// PUT /admin/faculty/:id/remove-subject
exports.removeSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectId, semester, academicYear } = req.body;

    const faculty = await Faculty.findById(id);
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });

    // find year block
    let yearBlock = faculty.assignedSubjects.find(
      (a) => a.academicYear === academicYear
    );
    if (!yearBlock) {
      return res
        .status(400)
        .json({ error: "No assignments found for this year" });
    }

    // find semester block
    let semBlock = yearBlock.semesters.find((s) =>
      s.subjects.some((sub) => String(sub.subjectId) === String(subjectId))
    );
    if (!semBlock) {
      return res
        .status(400)
        .json({ error: "No such subject found in this year/semester" });
    }

    // remove subject
    semBlock.subjects = semBlock.subjects.filter(
      (sub) => String(sub.subjectId) !== String(subjectId)
    );

    // clean up empty semesters 
    if (semBlock.subjects.length === 0) {
      yearBlock.semesters = yearBlock.semesters.filter((s) => s !== semBlock);
    }

    // clean up empty year blocks 
    if (yearBlock.semesters.length === 0) {
      faculty.assignedSubjects = faculty.assignedSubjects.filter(
        (a) => a !== yearBlock
      );
    }

    await faculty.save();
    res.status(200).json({ message: "Subject removed successfully", faculty });
  } catch (err) {
    console.error("Error removing subject:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET /admin/faculty/getAll
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties =
      await Faculty.find(); /* .populate("assignedSubjects.subjectId"); */
    res.json(faculties);
  } catch (err) {
    res.status(500).json({ error: "Failed to get faculties (Backend Error)" });
  }
};


exports.getSingleFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(
      req.params.id
    ); /* .populate("assignedSubjects.subjectId"); */
    if (!faculty) return res.status(404).json({ error: "Faculty not found" });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ error: "Error fetching faculty" });
  }
};


exports.editFaculty = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If password is provided, hash it before updating
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    // .populate("assignedSubjects.subjectId");

    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty Updated Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Update failed", details: err.message });
  }
};


exports.deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
