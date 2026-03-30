const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  return "dev_secret_change_me";
};

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Admin authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (decoded.role !== "admin" || !decoded.username) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.adminUsername = decoded.username;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};

module.exports = adminAuthMiddleware;
