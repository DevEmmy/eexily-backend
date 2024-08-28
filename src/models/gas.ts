import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Gas model
export interface IGas extends Document {
  size: string;
  ownedBy: Types.ObjectId;
}

// Define the Gas schema
const GasSchema = new Schema<IGas>({
  size: { type: String, required: true },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

// Create the Gas model
const Gas = mongoose.model<IGas>('Gas', GasSchema);
export default Gas;
