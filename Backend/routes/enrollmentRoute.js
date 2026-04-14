const express = require("express");
const enrollmentRouter = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const isAdmin = require("../controllers/isAdmin");
const { jwtAuthMiddleware } = require("../jwt");

// POST create new enrollment record

enrollmentRouter.post("/create", enrollmentController.createEnrollment);
enrollmentRouter.get("/list", enrollmentController.getEnrollments);
enrollmentRouter.put("/update/:id", enrollmentController.updateEnrollment);
enrollmentRouter.get("/subjects", enrollmentController.getSubjectsFromEnrollment);

module.exports = enrollmentRouter;
