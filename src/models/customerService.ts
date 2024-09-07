import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the CustomerService model
export interface ICustomerService extends Document {
  user: Types.ObjectId;
}

// Define the CustomerService schema
const CustomerServiceSchema = new Schema<ICustomerService>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Create the CustomerService model
const CustomerService = mongoose.model<ICustomerService>('CustomerService', CustomerServiceSchema);
export default CustomerService;
