import express from 'express';
import { getSkill, addSkill, updateSkill, deleteSkill } from '../controllers/skillsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSkill);
router.post('/', verifyToken, addSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

export default router;
