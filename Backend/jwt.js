const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "24h" });
};

module.exports = { jwtAuthMiddleware, generateToken };
// const jwt = require("jsonwebtoken");

// const jwtAuthMiddleware = (req, res, next) => {
//   //First check the request header has authorization or not
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "Token not found" });

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ error: "Authorization token missing or malformed" });
//   }

//   //Extract the jwt token from the request headers
//   const token = req.headers.authorization.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "Unauthorized" });

//   try {
//     //Verify the JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     //Attach user information to the request object
//     req.user = decoded;
//     next();
//   } catch (err) {
//     console.error("JWT verification failed:", err.message);
//     res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// //function to generate JWT token
// const generateToken = (userData) => {
//   //Generate a new JWT token using user data
//   return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hours
// };

// module.exports = { jwtAuthMiddleware, generateToken };
