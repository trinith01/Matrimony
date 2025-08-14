import mongoose from 'mongoose';

const backGroundCheckedRequestsSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or any relevant model
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or any relevant model
    required: true
  },
  criminalStatus: {
    type: String,
    default:"pending"
  
  },
  maritalStatus: {
    type: String,
    default:"pending"
    
  },
  employmentCheck: {
    type: String,
    default:"pending"
   
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', ],
    default: 'pending'
  },
}, {
  timestamps: true
});

const BackGroundCheckedRequests = mongoose.model('BackGroundCheckedRequests', backGroundCheckedRequestsSchema);

export default BackGroundCheckedRequests;
