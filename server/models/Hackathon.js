import mongoose from "mongoose";

const HackathonSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    organizer:    { type: String, trim: true },          // e.g. "e-Yantra Robotics - IIT Bombay"
    rank:         { type: String, trim: true },          // e.g. "Top 25 Nationally"
    description:  { type: String, trim: true },
    techStack:    { type: [String], default: [] },       // tech tags
    achievements: { type: [String], default: [] },       // bullet points (checkmark list)
    github:       { type: String, trim: true },
    liveDemo:     { type: String, trim: true },
    image:        { type: String, trim: true },
    year:         { type: String, trim: true },
    featured:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

HackathonSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model("Hackathon", HackathonSchema);