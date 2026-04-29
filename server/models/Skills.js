import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], 
      default: 'Intermediate' 
    },
    category: { type: String }, 
    icon: { type: String },     
    isTop: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

export default mongoose.model('Skill', SkillSchema);