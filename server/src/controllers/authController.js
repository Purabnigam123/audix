const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  return "dev_secret_change_me";
};

const createToken = (userId) =>
  jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: "7d",
  });

const createAdminToken = (username) =>
  jwt.sign(
    { role: "admin", username },
    getJwtSecret(),
    {
      expiresIn: "12h",
    }
  );

const secureCompare = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const verifyAdminPassword = async (password) => {
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const isProduction = process.env.NODE_ENV === "production";

  if (configuredHash) {
    return bcrypt.compare(password, configuredHash);
  }

  if (configuredPassword) {
    return secureCompare(password, configuredPassword);
  }

  if (!isProduction) {
    return secureCompare(password, "admin123");
  }

  return false;
};

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  address: user.address,
  phone: user.phone,
  pincode: user.pincode,
});

const signup = async (req, res) => {
  try {
    const { name, address, phone, pincode, password } = req.body;

    if (!name || !address || !phone || !pincode || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      address,
      phone,
      pincode,
      passwordHash,
      wishlist: [],
      cart: [],
    });

    const token = createToken(user._id);

    return res.status(201).json({
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed" });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    return res.json({
      token,
      user: toSafeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: toSafeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const isProduction = process.env.NODE_ENV === "production";
    const adminUsername = process.env.ADMIN_USERNAME || (isProduction ? "" : "admin");

    if (!adminUsername) {
      return res.status(500).json({ message: "Admin credentials are not configured" });
    }

    const isUsernameValid = secureCompare(username, adminUsername);
    const isPasswordValid = await verifyAdminPassword(password);

    if (!isUsernameValid || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = createAdminToken(adminUsername);

    return res.json({
      token,
      admin: { username: adminUsername },
    });
  } catch (error) {
    return res.status(500).json({ message: "Admin login failed" });
  }
};

const getAdminMe = async (req, res) => {
  return res.json({
    admin: {
      username: req.adminUsername,
    },
  });
};

module.exports = {
  signup,
  login,
  getMe,
  adminLogin,
  getAdminMe,
};
