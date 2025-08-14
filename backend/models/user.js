import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password_hash: { type: String, required: true },
  gender: { type: String, required: true },
  religion: { type: String, required: true },
  caste: { type: String, required: true },
  mother_tongue: { type: String, required: true },
  occupation: { type: String, required: true },
  education: { type: String, required: true },
  income: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  profile_photo: { type: String },
  gallery: [{ type: String }],
  verified: { type: Boolean, default: false },
  account_status: { type: String, enum: ["active", "inactive"], default: "active" },
  subscription_plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
  //interests_sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  //interests_received: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  shortlisted_profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  birthday: { type: Date, required: true },
  
 
  profile_views_today: { type: Number, default: 0 },
  interest_today: { type: Number, default: 0 },
}, {
  timestamps: true, // Automatically adds createdAt & updatedAt fields
});

// Auto-update `updated_at`
userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
