import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const mimeType = req.file.mimetype || '';
    const isPdf    = mimeType === 'application/pdf';

    const uploadOptions = {
      folder:        'portfolio',
      resource_type: isPdf ? 'raw' : 'image',
      use_filename:  true,
      unique_filename: true,
    };

    const streamUpload = (buf) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          uploadOptions,
          (error, result) => { if (result) resolve(result); else reject(error); }
        );
        streamifier.createReadStream(buf).pipe(stream);
      });

    const result = await streamUpload(req.file.buffer);

    let url = result.secure_url;
    if (isPdf && !/\.pdf$/i.test(url.split('?')[0])) {
      url = url + '.pdf';
    }

    return res.json({
      success:  true,
      url,
      fileType: isPdf ? 'pdf' : 'image',
      raw:      result,
    });
  } catch (err) {
    console.error('uploadImage error', err);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
};