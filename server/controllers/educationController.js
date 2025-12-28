import Qualification from '../models/educationModel.js';

export const getQualifications = async (req, res) => {
  const data = await Qualification.find();
  res.json(data);
};

export const addQualification = async (req, res) => {
  const q = new Qualification(req.body);
  await q.save();
  res.json(q);
};

export const updateQualification = async (req, res) => {
  const q = await Qualification.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(q);
};

export const deleteQualification = async (req, res) => {
  await Qualification.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
};
