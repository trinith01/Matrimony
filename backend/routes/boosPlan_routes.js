import express from "express";
import { createBoostPlan, getBoostPlans, deleteBoostPlan} from "../controllers/boostPlan_controllers.js"


const boostRouter = express.Router();

// Boost Plan Routes
boostRouter.get("/" ,getBoostPlans)
boostRouter.post("/" ,createBoostPlan);
boostRouter.route("/:id").delete(deleteBoostPlan)




export default boostRouter;
