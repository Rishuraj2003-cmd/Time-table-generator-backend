import mongoose from 'mongoose';
const SettingsSchema = new mongoose.Schema({
  days: { type: [String], default: ['Mon','Tue','Wed','Thu','Fri','sat'] },
  periodsPerDay: { type: Number, default: 6, min: 1, max: 12 }
}, { timestamps: true });
export default mongoose.model('Settings', SettingsSchema);
