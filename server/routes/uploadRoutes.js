import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage(); // keep in memory then stream to cloudinary
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", verifyToken, upload.single("file"), uploadImage);

export default router;
