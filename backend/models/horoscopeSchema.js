import mongoose from "mongoose";

const HoroscopeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ref to User
    sunSign: { type: String,  },
    moonSign: { type: String, },
    risingSign: { type: String, },
    planetaryPlacements: { type: String },
    houses: { type: String },
    aspects: { type: String },
    lunarNodes: { type: String },
    chironAsteroids: { type: String },
    transits: { type: String },
    progressions: { type: String },
    solarLunarReturns: { type: String },
    eclipses: { type: String },
    elementalAnalysis: { type: String },
    planetaryDignities: { type: String },
    venusMars: { type: String },
    saturnReturn: { type: String },
    astrologicalTiming: { type: String },
    vimshottariDasha: { type: String },
    navamsaChart: { type: String }, // Image URL or base64 string
    arudhaLagna: { type: String },
    status :{type:String, default:"processing"},
    
    // Store PDF as binary data (OPTION 1 - If storing directly in MongoDB)
    horoscopePDF: { type:String, required: true}// PDF file as binary data

  
}, { timestamps: true });

const Horoscope = mongoose.model('Horoscope', HoroscopeSchema);
export default Horoscope;