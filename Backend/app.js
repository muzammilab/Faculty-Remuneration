//External Module
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//local Module
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const facultyAuthRoute = require("./routes/facultyAuthRoute");
const adminAuthRoute = require("./routes/adminAuthRoute");
const subjectRouter = require("./routes/subjectRoute");
const facultyManagement = require("./routes/facultyManagement");
const paymentRouter = require("./routes/paymentRoute");
const generatePDF = require("./routes/genereate-pdf");
const forgetPasswordRouter = require("./routes/forgetPasswordRoute");
const changePasswordRouter = require("./routes/changePasswordRoute");
const checkRoleRoute = require("./routes/checkRole");
const amountPayRouter = require("./routes/amountPayRoute");
const passport = require("passport");
const googleAuthRoute = require("./routes/googleAuthRoute");
require("./google");

const MONGO_DB_URL = process.env.MONGO_URI;
const app = express();

// app.use(
//   cors({
//     origin: "https://jwtbased-website-e-voting.netlify.app", // ✅ your frontend URL
//     credentials: true, // ✅ required for cookies
//   })
// );
app.use(
  cors({
    origin: process.env.FRONTEND_DEV_URL,
    credentials: true, // if using cookies / sessions
  })
);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", googleAuthRoute);
app.use("/", checkRoleRoute);
app.use("/faculty", facultyAuthRoute);
app.use("/admin", adminAuthRoute);
app.use("/faculty/subject", subjectRouter);
app.use("/admin/faculty", facultyManagement);
app.use("/admin/payment", paymentRouter);
app.use("/payment", generatePDF);
app.use("/", forgetPasswordRouter);
app.use("/", changePasswordRouter);
app.use("/", amountPayRouter);

const PORT = process.env.PORT || 3003;

mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error while connecting to MongoDB", err);
  });
