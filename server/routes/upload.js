import express from 'express';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file?.path) return res.status(400).json({ error: 'Upload failed' });
  res.json({ url: req.file.path });
});

export default router;
