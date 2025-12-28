// ExperienceController.js
import Experience from '../models/Experience.js';

// GET all experiences
export const getExperience = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST a new experience
export const addExperience = async (req, res) => {
  try {
    const newExp = new Experience(req.body);
    await newExp.save();
    res.status(201).json(newExp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT (update) an existing experience
export const updateExperience = async (req, res) => {
  try {
    const updatedExp = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedExp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE an experience
export const deleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
