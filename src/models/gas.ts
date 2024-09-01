import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Usage model
export interface IUsage extends Document {
  amountUsed: number;
  usedAt: Date;
  description: string;
}

// Define the Usage schema
const UsageSchema = new Schema<IUsage>({
  amountUsed: { type: Number, required: true },
  usedAt: { type: Date, default: Date.now },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

// Define an interface for the Gas model
export interface IGas extends Document {
  size: string;
  ownedBy: Types.ObjectId;
  lastFilled: Date;
  level: number;
  usage: Types.DocumentArray<IUsage>;  // Adding usage as an array of IUsage documents
}

// Define the Gas schema
const GasSchema = new Schema<IGas>({
  size: { type: String, required: true },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lastFilled: { type: Date, default: null },
  level: { type: Number, default: 100 },
  usage: { type: [UsageSchema], default: [] }  // Initialize usage as an empty array
}, {
  timestamps: true
});

// Create the Gas model
const Gas = mongoose.model<IGas>('Gas', GasSchema);
export default Gas;
