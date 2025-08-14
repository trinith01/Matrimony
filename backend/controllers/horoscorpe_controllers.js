import Horoscope from "../models/horoscopeSchema.js";


// Create a new horoscope entry
export const createHoroscope = async (req, res) => {
    try {
        const { userId, horoscopePDF } = req.body;
        
        

        const newHoroscope = new Horoscope({
            userId,
        
            
            horoscopePDF
        });

        await newHoroscope.save();
        res.status(201).json({ message: "Horoscope saved successfully.", horoscope: newHoroscope });
    } catch (error) {
        res.status(500).json({ message: "Error saving horoscope.", error });
    }
};

// Get all horoscopes
export const getHoroscopes = async (req, res) => {
    try {
        const horoscopes = await Horoscope.find().populate("userId", "name email"); 
        res.status(200).json(horoscopes);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving horoscopes.", error });
    }
};

// Get a single horoscope by ID
export const getHoroscopeById = async (req, res) => {
    try {
        const { id } = req.params;
        const horoscope = await Horoscope.findById(id).populate("userId", "name email");
        
        if (!horoscope) {
            return res.status(404).json({ message: "Horoscope not found." });
        }

        res.status(200).json(horoscope);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving horoscope.", error });
    }
};
export const getHoroscopeUsers = async(req, res) =>{
    try{
        const horoscopes = await Horoscope.find({}).select("userId").lean();

        // Map through the horoscopes and extract userId, converting ObjectId to string
        const userIds = horoscopes.map(h => h.userId.toString());

        // Send the userIds as the response
        res.status(200).json(userIds);


        

    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Error retrieving horoscopes.", err });

    }
}
export const getHoroscopeByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const horoscope = await Horoscope.findOne({ userId }).populate("userId", "name email");

        if (!horoscope) {
            return res.status(404).json({ message: "Horoscope not found." });
        }

        res.status(200).json(horoscope);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving horoscope.", error });
    }
}

// Update a horoscope
export const updateHoroscope = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (req.file) {
            updatedData.horoscopePDF = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const updatedHoroscope = await Horoscope.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedHoroscope) {
            return res.status(404).json({ message: "Horoscope not found." });
        }

        res.status(200).json({ message: "Horoscope updated successfully.", horoscope: updatedHoroscope });
    } catch (error) {
        res.status(500).json({ message: "Error updating horoscope.", error });
    }
};

// Delete a horoscope
export const deleteHoroscope = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHoroscope = await Horoscope.findByIdAndDelete(id);

        if (!deletedHoroscope) {
            return res.status(404).json({ message: "Horoscope not found." });
        }

        res.status(200).json({ message: "Horoscope deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting horoscope.", error });
    }
};
