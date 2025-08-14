import express from "express";
import {
    createInterest,
    deleteIneterest,
    updateInterest,
    getsentInterests,
    getReceivedInterests
} from "../controllers/interest_controllers.js";

const interestRouter = express.Router();

// Route to create a new interest
interestRouter.route('/').post(createInterest);

// Route to delete an interest by its ID
interestRouter.route('/:id').delete(deleteIneterest);

// Route to update the status of an interest
interestRouter.route('/:id').put(updateInterest);

// Route to get all sent interests for a user
interestRouter.route('/sent/:id').get(getsentInterests);

// Route to get all received interests for a user
interestRouter.route('/received/:id').get(getReceivedInterests);

export default interestRouter;
