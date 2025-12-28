import Project from '../models/Project.js';
import Certificate from '../models/Certificate.js';
import Skill from '../models/Skills.js';
import Admin from '../models/admin.js';

export const getAdminStats = async (req, res) => {
  try {
    const [projects, certificates, skills, admins] = await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Skill.countDocuments(),
      Admin.countDocuments()
    ]);
    return res.json({ success:true, data: { projects, certificates, skills, admins }});
  } catch (err) {
    return res.status(500).json({ success:false, message:'Stats error' });
  }
};
