import express from 'express';
import { body } from 'express-validator';
import { listProjects, getProject, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProject);

router.post(
  '/',
  verifyToken,
  [ body('title').isLength({ min: 3 }).withMessage('Title min 3 chars') ],
  createProject
);

router.put('/:id', verifyToken, [
  body('title').optional().isLength({ min: 3 }).withMessage('Title min 3 chars')
], updateProject);

router.delete('/:id', verifyToken, deleteProject);

export default router;
