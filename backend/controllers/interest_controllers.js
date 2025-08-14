import Interest from "../models/interest.js";
import User from "../models/user.js";

 export const  createInterest = async (req, res) => {
    const {fromId , toId} = req.body;
    try {
        const interest = new Interest(req.body);
        const user = await User.findById(fromId);
    
        user.interest_today = user.interest_today + 1;
        await user.save();
        await interest.save();
        res.status(201).json(interest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
}

export const deleteIneterest = async (req, res) => {
    try {
        const interest = await Interest.findByIdAndDelete(req.params.id);
        res.status(200).json(interest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const updateInterest = async (req, res) => {
    try {
        // Find the interest request by ID
        const interest = await Interest.findById(req.params.id);
        if (!interest) {
            return res.status(404).json({ error: "Interest not found" });
        }

        // Update both users' contact lists
        await User.findByIdAndUpdate(interest.fromId, { 
            $addToSet: { contacts: interest.toId }  // Prevents duplicate contacts
        });

        await User.findByIdAndUpdate(interest.toId, { 
            $addToSet: { contacts: interest.fromId }
        });

        // Delete the interest object from the database
        await Interest.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Interest accepted and removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getsentInterests = async (req, res) => {
    try{
        const sentInterests = await Interest.find({fromId: req.params.id ,status: "pending"}).populate("toId");
        res.status(200).json(sentInterests);
    }catch(error){
        res.status(500).json({error});
    }
    
}

export const getReceivedInterests = async (req, res) => {
    try{
        const receivedInterests = await Interest.find({toId: req.params.id , status: "pending"}).populate("fromId");
        res.status(200).json(receivedInterests);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}