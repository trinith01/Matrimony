import express from "express";
import { createHoroscopeRequest , getAllHoroscopeRequests , getHoroscopeRequestById , updateHoroscopeRequest , deleteHoroscopeRequest } from "../controllers/horoscope_request_controllers.js"
const horoscopeRequestRouter = express.Router();
// Route to create a new horoscope request
horoscopeRequestRouter.post("/", createHoroscopeRequest);
horoscopeRequestRouter.get("/", getAllHoroscopeRequests);
horoscopeRequestRouter.get("/:requesterId", getHoroscopeRequestById);
horoscopeRequestRouter.put("/:id", updateHoroscopeRequest);
horoscopeRequestRouter.delete("/:id", deleteHoroscopeRequest);

export default horoscopeRequestRouter;