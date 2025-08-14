import HoroscopeRequest from "../models/horoscopeRequest.js";
import Horoscope from "../models/horoscopeSchema.js";

// Create a new horoscope request
 export const createHoroscopeRequest = async (req, res) => {
    try {
        const newRequest = await HoroscopeRequest.create(req.body);
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all horoscope requests
export const getAllHoroscopeRequests = async (req, res) => {
    try {
        const requests = await HoroscopeRequest.find()
            .populate('requesterId', 'name email profile_photo')
            .populate('receiverId', 'name email profile_photo')
            
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single horoscope request by ID
export const getHoroscopeRequestById = async (req, res) => {
    try {
        const {requesterId} = req.params
        console.log(requesterId)
        const horoscopeRequest = await HoroscopeRequest.find({ requesterId: requesterId })
            .populate('requesterId', 'name email')
            .populate('receiverId', 'name email')
          

        // if (!request) return res.status(404).json({ message: 'Request not found' });
        res.send(horoscopeRequest)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a horoscope request
export const updateHoroscopeRequest = async (req, res) => {
    try {
        const updatedRequest = await HoroscopeRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });
        res.status(200).json(updatedRequest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a horoscope request
 export const deleteHoroscopeRequest = async (req, res) => {
    try {
        const deletedRequest = await HoroscopeRequest.findByIdAndDelete(req.params.id);
        if (!deletedRequest) return res.status(404).json({ message: 'Request not found' });
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


