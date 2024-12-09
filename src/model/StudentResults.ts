import mongoose from 'mongoose';

const studentResultsSchema = new mongoose.Schema(
  {
    rollNumber: { type: Number, required: true , unique:true },
    name: { type: String, required: true },
    marks: { type: Number, required: true },
    resultImage: {
      imageUrl: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.StudentResults || mongoose.model('StudentResults', studentResultsSchema);
