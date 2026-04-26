import mongoose from "mongoose";

// ── Upgraded Education / Qualification Schema ────────────────────────────────
// New fields added based on UI design (Image 3):
//   - location    : e.g. "Bangalore, India"
//   - grade       : e.g. "9.2/10" (CGPA / percentage)
//   - courses     : relevant coursework array
//   - highlights  : bullet point achievements (active participant in hackathons, etc.)
//   - description : optional paragraph description

const qualificationSchema = new mongoose.Schema(
  {
    degree:      { type: String, required: true, trim: true },  // "Bachelor of Technology..."
    institution: { type: String, trim: true },                  // "BMS College of Engineering"
    year:        { type: String, trim: true },                  // "2020 - 2024"
    location:    { type: String, trim: true },                  // "Bangalore, India"
    grade:       { type: String, trim: true },                  // "9.2/10"
    gradeType:   { type: String, enum: ["cgpa", "aggregate"], default: "cgpa" }, // label selector
    description: { type: String, trim: true },
    courses:     { type: [String], default: [] },               // coursework tags
    highlights:  { type: [String], default: [] },               // checkmark bullet points
  },
  { timestamps: true }
);

const Qualification = mongoose.model("Qualification", qualificationSchema);
export default Qualification;