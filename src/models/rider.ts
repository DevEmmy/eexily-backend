import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Rider model
export interface IRider extends Document {
  user: Types.ObjectId;
  driverLicense?: string;
  expiryDate?: Date;
  workPlaceAddress?: string;
  profilePicture?: string;
}

// Define the Rider schema
const RiderSchema = new Schema<IRider>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverLicense: { type: String },
  expiryDate: { type: Date },
  workPlaceAddress: { type: String },
  profilePicture: { type: String },
}, {
  timestamps: true
});

// Create the Rider model
const Rider = mongoose.model<IRider>('Rider', RiderSchema);
export default Rider;
