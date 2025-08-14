import BoostPlan from "../models/boostPlan.js";

// Create a Boost Plan
export const createBoostPlan = async (req, res) => {
  try {
    const { name, duration, price } = req.body;
    const newBoostPlan = new BoostPlan({ name, duration, price });
    await newBoostPlan.save();
    res.status(201).json(newBoostPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Boost Plans
export const getBoostPlans = async (req, res) => {
  try {
    const plans = await BoostPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Boost Plan
export const deleteBoostPlan = async (req, res) => {
  try {
    await BoostPlan.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Boost plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
