const express = require("express");
const subjectRouter = express.Router();
const subjectController = require("../controllers/subjectController");
const Subject = require("../models/subjects");
const isAdmin = require("../controllers/isAdmin");
const { jwtAuthMiddleware } = require("../jwt");

// GET all subjects (optionally filtered by semester or department)
subjectRouter.get(
  "/getList",
  jwtAuthMiddleware,
  isAdmin,
  subjectController.getSubjects
);

// GET subject by Id
subjectRouter.get(
  "/getList/:id",
  
  subjectController.getSubjectById
);

// POST create new subject
subjectRouter.post(
  "/create",
  jwtAuthMiddleware,
  isAdmin,
  subjectController.postCreate
);

// PUT update subject
subjectRouter.put(
  "/update/:id",
  jwtAuthMiddleware,
  isAdmin,
  subjectController.putUpdate
);

// DELETE subject
subjectRouter.delete(
  "/delete/:id",
  jwtAuthMiddleware,
  isAdmin,
  subjectController.delete
);

// POST /api/admin/subjects/bulk — Create multiple subjects
subjectRouter.post(
  "/bulk",
  jwtAuthMiddleware,
  isAdmin,
  subjectController.createBulk
);

module.exports = subjectRouter;
