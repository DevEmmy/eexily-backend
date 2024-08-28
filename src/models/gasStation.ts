import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: "User", required: true},
    gastStationName: {type: String, required: true},
},
{
    timestamps: true
})

const GasStation = mongoose.model('GasStation', schema);
export default GasStation;