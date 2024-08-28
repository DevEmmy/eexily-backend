import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: "User", required: true},
    driverLisence: {type: String},
    expiryDate: {type: Date},
    workPlaceAddress: {type: String},
    profilePicture: {type: String}
},
{
    timestamps: true
})

const Rider = mongoose.model('Rider', schema);
export default Rider;