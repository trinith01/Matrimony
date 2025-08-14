import BackGroundCheckedRequests from "../models/backGroundCheckRequests.js";

// Create a new request
export const createRequest = async (req, res) => {
  try {
    const newRequest = new BackGroundCheckedRequests(req.body);
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await BackGroundCheckedRequests.find().populate("requesterId", "name").populate("receiverId", "name");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await BackGroundCheckedRequests.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a request by ID
export const updateRequest = async (req, res) => {
  try {
    const updated = await BackGroundCheckedRequests.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a request by ID
export const deleteRequest = async (req, res) => {
  try {
    await BackGroundCheckedRequests.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRequestByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await BackGroundCheckedRequests.find({
       requesterId: userId ,
    }).populate("requesterId", "name").populate("receiverId", "name");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
