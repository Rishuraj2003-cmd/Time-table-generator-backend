import mongoose from 'mongoose';
const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  totalLectures: { type: Number, required: true, min: 0 },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, { timestamps: true });
export default mongoose.model('Subject', SubjectSchema);
