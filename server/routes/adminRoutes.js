import express from "express";
import { body } from "express-validator";
import { registerAdmin, loginAdmin, logoutAdmin, getAdminData } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  registerAdmin
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Provide a valid email"),
    body("password").exists().withMessage("Password required"),
  ],
  loginAdmin
);

router.post("/logout", verifyToken, logoutAdmin);
router.get("/me", verifyToken, getAdminData);

export default router;
