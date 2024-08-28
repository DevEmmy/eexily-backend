import mongoose, {Schema} from "mongoose";

const schema = new Schema({
    user : {type: Schema.Types.ObjectId, ref: "User", required: true},
},
{
    timestamps: true
})

const CustomerService = mongoose.model('CustomerService', schema);
export default CustomerService;