import { gelAllPlansById , createPlan , getAllPlans , updatePlan , deletePlan} from "../controllers/plan_controllers.js";
import express from "express";

const planRouter = express.Router();

planRouter.get("/", getAllPlans);
planRouter.get("/:id", gelAllPlansById);
planRouter.post("/", createPlan);   
planRouter.put("/:id", updatePlan);
planRouter.delete("/:id", deletePlan);

export default planRouter;
