import mongoose from "mongoose";

const boostPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in days
  price: { type: Number, required: true },
});

const BoostPlan = mongoose.model("BoostPlan", boostPlanSchema);
export default BoostPlan;
