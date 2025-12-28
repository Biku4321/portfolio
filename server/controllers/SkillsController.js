import Skill from '../models/Skills.js';

// GET all skills
export const getSkill = async (req, res) => {
  console.log("🔥 /api/skills route hit");
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST a new skill
export const addSkill = async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT (update) an existing skill
export const updateSkill = async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a skill
export const deleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
