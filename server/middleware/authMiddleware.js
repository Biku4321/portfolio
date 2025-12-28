import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.JWT_COOKIE_NAME || "token";

export const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Check cookie if header missing
    if (!token && req.cookies && req.cookies[COOKIE_NAME]) {
      token = req.cookies[COOKIE_NAME];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure admin exists and active
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Admin not found or disabled" });
    }

    // Attach user info to request
    req.user = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    };
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
