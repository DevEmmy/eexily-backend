import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Individual model
export interface IIndividual extends Document {
  user: Types.ObjectId;
  address?: string;
  gasSize?: number;
  firstName?:string;
  lastName?: string,
  location?: string,
}

// Define the Individual schem
const IndividualSchema = new Schema<IIndividual>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  gasSize: {type: Number},
  firstName: String,
  lastName: String,
  location: String
}, {
  timestamps: true
});

// Create the Individual model
const Individual = mongoose.model<IIndividual>('Individual', IndividualSchema);
export default Individual;
