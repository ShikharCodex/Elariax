const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const createToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = asyncHandler(async (req, res) => {
  const { email, password, userName } = req.body;
  if (!email || !password || !userName) {
    return res.status(400).json({ success: false, message: "email, password and userName are required." });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: "Email already registered." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, userName });
  res.status(201).json({ success: true, data: { token: createToken(user), user } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials." });

  res.json({ success: true, data: { token: createToken(user), user } });
});

const me = asyncHandler(async (req, res) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }
  const user = await User.findById(req.auth.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, data: user });
});

module.exports = { register, login, me };
