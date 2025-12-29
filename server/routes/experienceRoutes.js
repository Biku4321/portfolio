import express from 'express';
import { getExperience, addExperience, updateExperience, deleteExperience } from '../controllers/ExperienceController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getExperience);
router.post('/', verifyToken, addExperience);
router.put('/:id', verifyToken, updateExperience);
router.delete('/:id', verifyToken, deleteExperience);

export default router;
