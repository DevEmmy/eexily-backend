import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Individual model
export interface IIndividual extends Document {
  user: Types.ObjectId;
  address?: string;
  gas?: Types.ObjectId;
  firstName?:string;
  lastName?: string
}

// Define the Individual schema
const IndividualSchema = new Schema<IIndividual>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  gas: { type: Schema.Types.ObjectId, ref: 'Gas' },
  firstName: String,
  lastName: String
}, {
  timestamps: true
});

// Create the Individual model
const Individual = mongoose.model<IIndividual>('Individual', IndividualSchema);
export default Individual;
