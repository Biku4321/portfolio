import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
   role: { type: String, enum: ['owner','admin','editor'], default: 'admin' },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
