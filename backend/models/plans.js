import mongoose from "mongoose";


const planSchema = new mongoose.Schema({
  blurred_profile_photos: { type: Boolean, default: false },
  filters: [{
    age: { type: String },
    religion: { type: String },
    district: { type: String }
  }],
  interests_per_day: { type: Number, default: 3 },
  name: { type: String, default: 'Free' },
  ads_free: { type: Boolean, default: false },
  profile_views_per_day: { type: Number, default: 5 },
  monthly_price: { type: Number, default: 0 },
  yearly_price: { type: Number, default: 0 },
  horoscope_matching: { type: String, default: 'no' },
  priority_customer_support: { type: Boolean, default: false },
  checkable_contact_details: { type: [String], default: [] },
  profile_verification_badge: { type: Boolean, default: false },
  profile_boosts_per_month: { type: Number, default: 0 },
  access_to_webinars: { type: Boolean, default: false },
  consultant: { type: Boolean, default: false },
  offline_events: { type: Boolean, default: false },
  photo_shoot: { type: Boolean, default: false },
  background_checks: { type: Boolean, default: false },
  money_back_guarantee: { type: Boolean, default: false },
});

// Create a model from the schema
const Plan = mongoose.model('Plan', planSchema);

export default Plan;
