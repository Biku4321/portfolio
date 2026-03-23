import express from "express";
import {
  listHackathons,
  getHackathon,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} from "../controllers/hackathonController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",        listHackathons);
router.get("/:id",     getHackathon);
router.post("/",       verifyToken, createHackathon);
router.put("/:id",     verifyToken, updateHackathon);
router.delete("/:id",  verifyToken, deleteHackathon);

export default router;