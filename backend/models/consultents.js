import mongoose from "mongoose";


const consultantSchema = new mongoose.Schema({
  birth_day: { type: Date, required: true },
  consultant_id: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  qualifications: { type: String, default: '' },
  password_hash: { type: String, required: true },
  user_ids: [{
    type: Schema.Types.ObjectId, 
    ref: 'User' // Assuming User is another model in your app
  }],
  languages: [{
    type: String
  }]
});

// Create a model from the schema
const Consultant = mongoose.model('Consultant', consultantSchema);

export default Consultant;
