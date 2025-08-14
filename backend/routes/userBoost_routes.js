import express from "express";
import { assignBoostPlan, checkUserBoostStatus } from "../controllers/userBoost_controllers.js"

const userBoostRouter = express.Router();
userBoostRouter.post("/user-boosts", assignBoostPlan);
userBoostRouter.get("/user-boosts/:id", checkUserBoostStatus);

export default userBoostRouter;