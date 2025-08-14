import mongoose from "mongoose";

const userBoostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  boost_plan: { type: mongoose.Schema.Types.ObjectId, ref: "BoostPlan", required: true },
  boost_start_date: { type: Date, required: true },
  boost_end_date: { type: Date, required: true },
}, { timestamps: true });

const UserBoost = mongoose.model("UserBoost", userBoostSchema);
export default UserBoost;
