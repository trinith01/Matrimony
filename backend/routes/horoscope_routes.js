import { createHoroscope ,getHoroscopeById,getHoroscopeByUserId , getHoroscopes , updateHoroscope , deleteHoroscope , getHoroscopeUsers } from "../controllers/horoscorpe_controllers.js";
import express from "express";

const horoscopeRouter = express.Router();
horoscopeRouter.get("/", getHoroscopes);
horoscopeRouter.get("/:id", getHoroscopeById);
horoscopeRouter.post("/", createHoroscope);
horoscopeRouter.put("/:id", updateHoroscope);
horoscopeRouter.delete("/:id", deleteHoroscope);
horoscopeRouter.get("/user/:userId", getHoroscopeByUserId);


export default horoscopeRouter;