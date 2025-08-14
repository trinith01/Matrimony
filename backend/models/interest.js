import mongoose from "mongoose";
const interesetSchema = new mongoose.Schema({
    fromId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    toId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    status:{type:String,default:"pending"}
    
},{ timestamps: true })

const Interest = mongoose.model("Interest",interesetSchema);
export default Interest;