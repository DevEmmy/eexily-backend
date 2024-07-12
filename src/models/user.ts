import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    firstName : {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    residence: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    generatedOtp: {type: String},
    generatedOtpExpiration: {type: Date}
},
{
    timestamps: true
})

const User = mongoose.model('User', schema);
export default User;