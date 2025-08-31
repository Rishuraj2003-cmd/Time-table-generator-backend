import mongoose from 'mongoose';
const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  maxLecturesPerWeek: { type: Number, required: true, min: 0 }
}, { timestamps: true });
export default mongoose.model('Teacher', TeacherSchema);
