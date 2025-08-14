import UserBoost from "../models/userBoost.js";
import BoostPlan from "../models/boostPlan.js";


// Assign a Boost Plan to a User
export const assignBoostPlan = async (req, res) => {
  try {
    const { userId, boostPlanId, startDate } = req.body;

    const boostPlan = await BoostPlan.findById(boostPlanId);
    if (!boostPlan) return res.status(404).json({ message: "Boost plan not found" });

    const boostStartDate = new Date(startDate);
    const boostEndDate = new Date(boostStartDate);
    boostEndDate.setDate(boostEndDate.getDate() + boostPlan.duration);

    const userBoost = new UserBoost({
      user: userId,
      boost_plan: boostPlanId,
      boost_start_date: boostStartDate,
      boost_end_date: boostEndDate
    });

    await userBoost.save();
    res.status(201).json(userBoost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if a user is boosted
export const checkUserBoostStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const now = new Date();

    const activeBoost = await UserBoost.findOne({
      user: userId,
      boost_start_date: { $lte: now },
      boost_end_date: { $gte: now }
    });

    res.status(200).json({ boosted: !!activeBoost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
