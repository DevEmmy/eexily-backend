import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Business model
export interface IBusiness extends Document {
  user: Types.ObjectId;
  address: string;
  category: string;
}

// Define the Business schema
const BusinessSchema = new Schema<IBusiness>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
}, {
  timestamps: true
});

// Create the Business model
const Business = mongoose.model<IBusiness>('Business', BusinessSchema);
export default Business;
