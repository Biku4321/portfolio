import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  issuer:    { type: String, trim: true },
  authority: { type: String, trim: true },   
  year:      { type: String, trim: true },
  url:       { type: String, trim: true },
  fileType:  { type: String, enum: ['image', 'pdf', 'link'], default: 'link' },
});

export default mongoose.model('Certificate', CertificateSchema);