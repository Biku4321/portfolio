// server/routes/blogRoutes.js
import express from "express";
import { getBlogs, getBlogById, createBlog, deleteBlog } from "../controllers/blogController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs); // Public: Badha blogs joy sake
router.get("/:id", getBlogById); // Public: Ek blog joy sake
router.post("/", verifyToken, createBlog); // Admin: Blog lakhi sake
router.delete("/:id", verifyToken, deleteBlog); // Admin: Blog delete kari sake

export default router;