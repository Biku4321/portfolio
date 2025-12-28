
import express from 'express';
import { getAbout, updateAbout, deleteAbout } from '../controllers/aboutControllers.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAbout);
router.post('/', verifyToken, updateAbout);
router.delete('/', verifyToken, deleteAbout); // Add delete route

export default router;
