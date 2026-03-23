import Hackathon from "../models/Hackathon.js";

// GET all hackathons (public)
export const listHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ featured: -1, createdAt: -1 }).lean();
    return res.json({ success: true, data: hackathons });
  } catch (err) {
    console.error("listHackathons error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch hackathons" });
  }
};

// GET single hackathon (public)
export const getHackathon = async (req, res) => {
  try {
    const h = await Hackathon.findById(req.params.id).lean();
    if (!h) return res.status(404).json({ success: false, message: "Hackathon not found" });
    return res.json({ success: true, data: h });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to get hackathon" });
  }
};

// POST create hackathon (admin)
export const createHackathon = async (req, res) => {
  try {
    const h = new Hackathon(req.body);
    const saved = await h.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("createHackathon error:", err);
    return res.status(500).json({ success: false, message: "Failed to create hackathon" });
  }
};

// PUT update hackathon (admin)
export const updateHackathon = async (req, res) => {
  try {
    const h = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).lean();
    if (!h) return res.status(404).json({ success: false, message: "Hackathon not found" });
    return res.json({ success: true, data: h });
  } catch (err) {
    console.error("updateHackathon error:", err);
    return res.status(500).json({ success: false, message: "Failed to update hackathon" });
  }
};

// DELETE hackathon (admin)
export const deleteHackathon = async (req, res) => {
  try {
    const h = await Hackathon.findByIdAndDelete(req.params.id);
    if (!h) return res.status(404).json({ success: false, message: "Hackathon not found" });
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete hackathon" });
  }
};