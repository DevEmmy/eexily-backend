import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Business model
export interface IBusiness extends Document {
  user: Types.ObjectId;
  address: string;
  houseHoldSize?: number;
  primaryCookingAppliance?: string;
  gas?: Types.ObjectId;
}

// Define the Business schema
const BusinessSchema = new Schema<IBusiness>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  houseHoldSize: { type: Number },
  primaryCookingAppliance: { type: String },
  gas: { type: Schema.Types.ObjectId, ref: 'Gas' },
}, {
  timestamps: true
});

// Create the Business model
const Business = mongoose.model<IBusiness>('Business', BusinessSchema);
export default Business;
