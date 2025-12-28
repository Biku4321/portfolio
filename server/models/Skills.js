import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    category: { type: String }, // e.g. Frontend, Backend, Database
    icon: { type: String },     // optional: store icon URL
  },
  { timestamps: true }
);

export default mongoose.model('Skill', SkillSchema);

// import mongoose from 'mongoose';

// const SkillSchema = new mongoose.Schema(
//   {
//     category: { type: String, required: true },     // e.g. "Frontend"
//     skills: [{ type: String, required: true }],     // e.g. ["React", "Vue"]
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Skill', SkillSchema);
