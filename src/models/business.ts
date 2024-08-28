import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: "User", required: true},
    address: {type: String, required: true},
    category: {type: String, required: true}
},
{
    timestamps: true
})

const Business = mongoose.model('Business', schema);
export default Business;