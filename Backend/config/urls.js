require("dotenv").config();
const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_PROD_URL
    : process.env.FRONTEND_DEV_URL;

// const BACKEND_URL =
//   process.env.NODE_ENV === "production"
//     ? process.env.BACKEND_PROD_URL
//     : process.env.BACKEND_DEV_URL;

module.exports =
  // {
  FRONTEND_URL;
//   BACKEND_URL,
// };
