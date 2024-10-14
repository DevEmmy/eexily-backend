import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Business model
export interface IBusiness extends Document {
  user: Types.ObjectId | string;
  address?: string;
  category?: string;
  businessName?:string
}

// Define the Business schema
const BusinessSchema = new Schema<IBusiness>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  category: { type: String },
  businessName: {type: String}
}, {
  timestamps: true
});

// Create the Business model
const Business = mongoose.model<IBusiness>('Business', BusinessSchema);
export default Business;
