// server/controllers/blogController.js
import Blog from "../models/Blog.js";

// --- GET ALL BLOGS (Public) ---
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Newest first
    res.json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

// --- GET SINGLE BLOG (Public) ---
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching blog" });
  }
};

// --- CREATE BLOG (Admin Only) ---
export const createBlog = async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json({ success: true, data: newBlog, message: "Blog published!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create blog" });
  }
};

// --- DELETE BLOG (Admin Only) ---
export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete blog" });
  }
};