import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the GasStation model
export interface IGasStation extends Document {
  user: Types.ObjectId;
  gasStationName: string;
}

// Define the GasStation schema
const GasStationSchema = new Schema<IGasStation>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gasStationName: { type: String, required: true },
}, {
  timestamps: true
});

// Create the GasStation model
const GasStation = mongoose.model<IGasStation>('GasStation', GasStationSchema);
export default GasStation;
