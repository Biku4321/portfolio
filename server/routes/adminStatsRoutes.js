import express from "express";
import { getAdminStats } from "../controllers/adminStats.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAdminStats);

export default router;
