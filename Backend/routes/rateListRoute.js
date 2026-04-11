const express = require("express");
const router = express.Router();
const { getRates, updateRates, getRateBasedOnMarks } = require("../controllers/rateListController");
const { jwtAuthMiddleware } = require("../jwt");
const isAdmin = require("../controllers/isAdmin");
const RateList = require("../models/rateList");

// GET ALL rates
router.get("/", jwtAuthMiddleware, isAdmin, getRates);

// UPDATE rates
router.put("/", jwtAuthMiddleware, isAdmin, updateRates);

// Example route to demonstrate how to access specific rates
router.post("/getRateBasedOnMarks",getRateBasedOnMarks);
module.exports = router;
