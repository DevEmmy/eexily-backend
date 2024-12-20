import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Rider model
export interface IRider extends Document {
  user: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  driverLicense?: string;
  expiryDate?: Date;
  workPlaceAddress?: string;
  profilePicture?: string;
  riderType: RiderType;
  gasStation: Types.ObjectId,
  address?: string,
  phoneNumber?: string,
  accountNumber: string;
  bankCode: string,
  bankName: string;
  accountName: string;
  location: string
}

export enum RiderType {
  DRIVER = "DRIVER",
  RIDER = "RIDER"
}

const RiderSchema = new Schema<IRider>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: String,
  lastName: String,
  address: String,
  phoneNumber: String,
  driverLicense: { type: String },
  bankCode: String,
  expiryDate: { type: Date },
  workPlaceAddress: { type: String },
  profilePicture: { type: String },
  riderType: { type: String, enum: Object.values(RiderType), default: RiderType.RIDER },
  gasStation: { type: Schema.Types.ObjectId, ref: "GasStation" },
  accountNumber: String,
  bankName: String,
  accountName: String,
  location: String
}, {
  timestamps: true
});

// Create the Rider model
const Rider = mongoose.model<IRider>('Rider', RiderSchema);
export default Rider;
