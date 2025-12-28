import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  period: String,
  description: String
});

export default mongoose.model('Experience', ExperienceSchema);
