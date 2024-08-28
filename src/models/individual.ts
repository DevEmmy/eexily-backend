import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: "User", required: true},
    address: {type: String, required: true},
    houseHoldSize: {type: Number},
    primaryCookingAppliance: {type: String},
    gas: {type: Schema.Types.ObjectId, ref: "Gas"}
},
{
    timestamps: true
})

const Business = mongoose.model('Business', schema);
export default Business;