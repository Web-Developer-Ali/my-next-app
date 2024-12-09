import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define the Admin schema
interface IAdmin extends Document {
  username: string;
  password: string;
}

const AdminSchema: Schema<IAdmin> = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Pre-save hook to hash the password before saving
AdminSchema.pre<IAdmin>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);

  // Explicitly casting `this` as IAdmin ensures TypeScript knows `this.password` is a string
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
