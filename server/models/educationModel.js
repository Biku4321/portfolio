import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
});

const Qualification = mongoose.model('Qualification', qualificationSchema);

export default Qualification;  // ✅ Fix: add default export
