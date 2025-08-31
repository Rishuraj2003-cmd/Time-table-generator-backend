import mongoose from 'mongoose';
const SlotSchema = new mongoose.Schema({
  day: String,
  period: Number,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { _id: false });

const TimetableSchema = new mongoose.Schema({
  grid: { type: [[SlotSchema]], required: true }, // rows = periods, cols = days
  meta: {
    days: [String],
    periodsPerDay: Number,
    generatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

export default mongoose.model('Timetable', TimetableSchema);
