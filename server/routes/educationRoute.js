import express from 'express';
import { getQualifications, addQualification, updateQualification, deleteQualification } from '../controllers/educationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getQualifications);
router.post('/', verifyToken, addQualification);
router.put('/:id', verifyToken, updateQualification);
router.delete('/:id', verifyToken, deleteQualification);

export default router;
