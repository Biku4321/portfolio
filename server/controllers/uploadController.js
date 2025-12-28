import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const buffer = req.file.buffer;
    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream({ folder: 'portfolio' }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await streamUpload(buffer);
    return res.json({ success: true, url: result.secure_url, raw: result });
  } catch (err) {
    console.error('uploadImage error', err);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
};
