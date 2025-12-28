import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";

import mongoose from "mongoose";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import adminAuthRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import educationRoutes from "./routes/educationRoute.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import dotenv from "dotenv";
dotenv.config();

console.log(
  "✅ Loaded JWT_SECRET:",
  process.env.JWT_SECRET ? "EXISTS" : "MISSING"
);

const app = express();
if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in .env");
}

// ✅ Enhanced CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(cookieParser());

// ✅ Rate limiter (register before auth routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, try again later" },
});
app.use("/api/admin", authLimiter);

// ✅ Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/admin/stats", adminStatsRoutes); // stats route now in its own file
app.use("/api/about", aboutRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "Portfolio API is live!", status: "success" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// ✅ 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ MongoDB + server startup
const PORT = process.env.PORT || 5000;
const mongoUri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
