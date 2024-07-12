import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    size : {type: String, required: true},
    houseHoldSize: {type: Number, required: true},
    primaryCookingAppliance: {type: String, required: true},
    ownedBy: {type: Schema.Types.ObjectId, ref: "User", required: true}
},
{
    timestamps: true
})

const Gas = mongoose.model('Gas', schema);
export default Gas;