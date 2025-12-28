import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  title: String,
  authority: String,
  year: String,
  url: String
});

export default mongoose.model('Certificate', CertificateSchema);
