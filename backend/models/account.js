import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    from_id: { type: Number, required: true },
    to_id: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

const accountsSchema = new mongoose.Schema({
    consultant_id: { type: String, required: true },
    interests_today: { type: Number, default: 0 },
    plan: { type: String, enum: ['VIP', 'Standard', 'Basic'], required: true },
    profile_boosts_this_month: { type: Number, default: 0 },
    profile_views_today: { type: Number, default: 0 },
    user_id: { type: Number, required: true, unique: true },
    matches: [matchSchema]
}, { timestamps: true });

const Accounts = mongoose.model('Accounts', accountsSchema);
export default Accounts;
