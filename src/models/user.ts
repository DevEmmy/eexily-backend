import mongoose, { Schema, Document } from 'mongoose';
import { UserType } from '../enum/userTypes';

// Define an interface for the User model
export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber: string
  isVerified: boolean;
  generatedOtp?: string;
  generatedOtpExpiration?: Date;
  type: UserType;
}

// Define the User schema
const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  phoneNumber: {type: String, required: false},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  isVerified: { type: Boolean, default: false },
  generatedOtp: { type: String },
  generatedOtpExpiration: { type: Date },
  
  type: {
    type: String,
    enum: Object.values(UserType),
    default: UserType.INDIVIDUAL,
  },
}, {
  timestamps: true
});

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
