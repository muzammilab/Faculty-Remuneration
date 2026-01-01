const express = require("express");
const facultyManagement = express.Router();
const facultyManagementC = require("../controllers/facultyManagementC");
const { jwtAuthMiddleware } = require("../jwt");
const isAdmin = require("../controllers/isAdmin");

// Add New Faculty
facultyManagement.post(
  "/add",
  /* jwtAuthMiddleware,
  isAdmin,  */
  facultyManagementC.addFaculty
);

// Update subject assignment
facultyManagement.put(
  "/:id/update",
  jwtAuthMiddleware,
  isAdmin,  
  facultyManagementC.updateAssignments
);

// Remove asssigned subjects
facultyManagement.put(
  "/:id/remove-subject",
  /* jwtAuthMiddleware,
  isAdmin, */  
  facultyManagementC.removeSubject
);

// Get All Faculties 
facultyManagement.get(
  "/getAll",
  jwtAuthMiddleware,
  isAdmin,
  facultyManagementC.getAllFaculties
);

// Get Single Faculty by ID
facultyManagement.get(
  "/getSingle/:id",
  /* jwtAuthMiddleware,
  isAdmin, */
  facultyManagementC.getSingleFaculty
);

// Edit/Update Faculty
facultyManagement.put(
  "/edit/:id",
  jwtAuthMiddleware,
  isAdmin,
  facultyManagementC.editFaculty
);

// Delete Faculty
facultyManagement.delete(
  "/delete/:id",
  jwtAuthMiddleware,
  isAdmin,
  facultyManagementC.deleteFaculty
);

module.exports = facultyManagement;
