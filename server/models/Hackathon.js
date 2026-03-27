import mongoose from "mongoose";

const HackathonSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true, trim: true },
    organizer:      { type: String, trim: true },
    rank:           { type: String, trim: true },
    description:    { type: String, trim: true },
    techStack:      { type: [String], default: [] },
    achievements:   { type: [String], default: [] },
    github:         { type: String, trim: true },
    liveDemo:       { type: String, trim: true },
    image:          { type: String, trim: true },
    year:           { type: String, trim: true },
    featured:       { type: Boolean, default: false },
    // ✅ NEW — certificate image/PDF URL (Cloudinary or direct link)
    certificateUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

HackathonSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model("Hackathon", HackathonSchema);
