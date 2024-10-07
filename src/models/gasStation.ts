import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the GasStation model
export interface IGasStation extends Document {
  user: Types.ObjectId;
  gasStationName?: string;
  address: string;
  phoneNumber?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  regCode?: string;
}

// Utility function to generate a 5-character alphanumeric string
function generateRegCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let regCode = '';
  for (let i = 0; i < 5; i++) {
    regCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return regCode;
}

// Define the GasStation schema
const GasStationSchema = new Schema<IGasStation>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  gasStationName: { type: String },
  address: { type: String, required: false },
  phoneNumber: String,
  accountNumber: String,
  accountName: String,
  bankName: String,
  regCode: { type: String, unique: true, index: true },  // Ensure regCode is unique and indexed
}, {
  timestamps: true
});

// Pre-save hook to generate regCode before saving
GasStationSchema.pre<IGasStation>('save', function (next) {
  if (!this.regCode) {
    this.regCode = generateRegCode();
  }
  next();
});

// Create the GasStation model
const GasStation = mongoose.model<IGasStation>('GasStation', GasStationSchema);
export default GasStation;
