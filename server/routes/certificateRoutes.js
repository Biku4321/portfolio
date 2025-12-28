import express from 'express';
import {
  getCertificates, addCertificate,
  addCertificatesBulk,
  updateCertificate,
  deleteCertificate
} from '../controllers/certificateController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCertificates);
router.post('/', verifyToken, addCertificate);
router.post('/bulk', verifyToken,addCertificatesBulk);
router.put('/:id', verifyToken, updateCertificate);
router.delete('/:id', verifyToken, deleteCertificate);

export default router;
