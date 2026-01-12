// server/models/Blog.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // Markdown support mate
    image: { type: String, trim: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);