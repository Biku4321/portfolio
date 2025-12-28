import mongoose from 'mongoose';

// --- SUB-SCHEMAS FOR NESTED DATA ---
const experienceSchema = new mongoose.Schema({
  yearsOfExperience: { type: String, default: "" },
  companiesWorked: { type: String, default: "" },
  projectsCompleted: { type: String, default: "" },
  clientsSatisfied: { type: String, default: "" },
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  metric: { type: String, default: "" },
  description: { type: String, default: "" },
  project: { type: String, default: "" },
  year: { type: String, default: "" },
}, { _id: false });

const expertiseSchema = new mongoose.Schema({
  primary: [String],
  secondary: [String],
  tools: [String],
  methodologies: [String],
}, { _id: false });


// --- MAIN ABOUT SCHEMA ---
const aboutSchema = new mongoose.Schema({
  name: String,
  title: String,
  tagline: String,
  bio: String,
  objective: String,
  email: String,
  phone: String,
  location: String,
  profileImage: String,
  github: String,
  linkedin: String,
  twitter: String,
  facebook: String,
  instagram: String,
  resumeLink: String,
  
  // --- NEW COMPLEX FIELDS ---
  experience: { type: experienceSchema, default: () => ({}) },
  achievements: { type: [achievementSchema], default: [] },
  expertise: { type: expertiseSchema, default: () => ({}) },
  industries: { type: [String], default: [] },

}, { timestamps: true, strict: false }); // Using strict: false to allow any fields from the form

export default mongoose.model('About', aboutSchema);