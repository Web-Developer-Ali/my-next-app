import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
