import mongoose from "mongoose";

const impactSchema = new mongoose.Schema({
  performanceImprovement: { type: String, default: "" },
  userEngagement: { type: String, default: "" },
  businessValue: { type: String, default: "" },
}, { _id: false });

const architectureSchema = new mongoose.Schema({
  frontend: { type: [String], default: [] },
  backend: { type: [String], default: [] },
  database: { type: String, default: "" },
  deployment: { type: String, default: "" },
}, { _id: false });

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    tech: [String],
    github: { type: String, trim: true },
    liveDemo: { type: String, trim: true },
    image: { type: String, trim: true },
    caseStudyUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    category: { type: String, trim: true },
    impact: { type: impactSchema, default: () => ({}) },
    architecture: { type: architectureSchema, default: () => ({}) },
  },
  { timestamps: true }
);

ProjectSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model("Project", ProjectSchema);