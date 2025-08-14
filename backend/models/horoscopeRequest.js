import mongoose from "mongoose";


const HoroscopeRequestSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who sent request
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who received request
   
    matchingScore: { type: Number , default: 0 }, // Score based on horoscope compatibility
    status: { type: String, enum: ['pending',  'reviewed'], default: 'pending' }, // Status of the request
}, { timestamps: true }); // Automatically adds createdAt & updatedAt

const HoroscopeRequest = mongoose.model('HoroscopeRequest', HoroscopeRequestSchema);
export default HoroscopeRequest;
