import Project from "../models/Project.js";

// --- LIST ALL PROJECTS (Public) ---
export const listProjects = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "12", 10)));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { tech: searchRegex }];
    }
    if (req.query.featured) {
      query.featured = true;
    }
     if (req.query.tags) {
      query.tech = { $in: req.query.tags.split(',') };
    }

    const sortOptions = { featured: -1 };
    if (req.query.sort === 'newest') sortOptions.createdAt = -1;
    if (req.query.sort === 'alpha') sortOptions.title = 1;


    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Project.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: projects,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("listProjects error:", err);
    return res.status(500).json({ success: false, message: "Failed to list projects" });
  }
};

// --- GET A SINGLE PROJECT (Public) ---
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    return res.json({ success: true, data: project });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to get project" });
  }
};

// --- CREATE A NEW PROJECT (Admin) ---
export const createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    return res.status(201).json({ success: true, data: savedProject });
  } catch (err) {
    console.error("createProject error:", err);
    return res.status(500).json({ success: false, message: "Failed to create project" });
  }
};

// --- UPDATE AN EXISTING PROJECT (Admin) ---
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProject) return res.status(404).json({ success: false, message: "Project not found" });

    return res.json({ success: true, data: updatedProject });
  } catch (err) {
    console.error("updateProject error:", err);
    return res.status(500).json({ success: false, message: "Failed to update project" });
  }
};

// --- DELETE A PROJECT (Admin) ---
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id).lean();
    if (!deletedProject) return res.status(404).json({ success: false, message: "Project not found" });
    return res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};