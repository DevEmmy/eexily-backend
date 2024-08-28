import mongoose, {Schema} from "mongoose";
import { UserType } from "../enum/userTypes";

const schema = new Schema({
    firstName : {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    
    isVerified: {type: Boolean, default: false},
    generatedOtp: {type: String},
    generatedOtpExpiration: {type: Date},
    type: {
        type: String,
        enum: Object.values(UserType),
        default: UserType.INDIVIDUAL
      }
      
},
{
    timestamps: true
})

const User = mongoose.model('User', schema);
export default User;