import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"; // fallback for dev
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: JWT_SECRET not set. Using fallback secret (unsafe for production).");
}
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "token";

const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  res.cookie(COOKIE_NAME, token, cookieOptions);
};

export const registerAdmin = async (req, res) => {
  // validation middleware should run before this; still check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ email, password: hashed });

    const token = jwt.sign(
  { id: admin._id, email: admin.email },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES }
);

    sendTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      data: { id: admin._id, email: admin.email },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

export const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const matched = await bcrypt.compare(password, admin.password);
    if (!matched) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    sendTokenCookie(res, token);

    return res.json({
      success: true,
      data: { id: admin._id, email: admin.email },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ success: true, message: "Logged out" });
};

export const getAdminData = async (req, res) => {
  // req.user must be set by auth middleware
  try {
    const admin = await Admin.findById(req.user.id).select("-password").lean();
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    return res.json({ success: true, data: admin });
  } catch (err) {
    console.error("Get admin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
