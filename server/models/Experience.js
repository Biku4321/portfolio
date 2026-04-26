import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  role:        { type: String, required: true },
  company:     { type: String, required: true },
  period:      { type: String },
  description: { type: String },
  skills:      [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Experience', ExperienceSchema);