import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Rider model
export interface IRider extends Document {
  user: Types.ObjectId;
  driverLicense?: string;
  expiryDate?: Date;
  workPlaceAddress?: string;
  profilePicture?: string;
  riderType: RiderType;
  gasStation: Types.ObjectId
}

export enum RiderType{
  DRIVER = "DRIVER",
  RIDER = "RIDER"
}

// Define the Rider schema
const RiderSchema = new Schema<IRider>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverLicense: { type: String },
  expiryDate: { type: Date },
  workPlaceAddress: { type: String },
  profilePicture: { type: String },
  riderType: {type: String, enum: Object.values(RiderType), default: RiderType.DRIVER},
  gasStation: {type: Schema.Types.ObjectId, ref: "GasStation"}
}, {
  timestamps: true
});

// Create the Rider model
const Rider = mongoose.model<IRider>('Rider', RiderSchema);
export default Rider;
