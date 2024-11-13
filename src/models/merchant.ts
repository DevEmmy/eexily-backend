import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMerchant extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    storeName: string;
    isOpened: boolean;
    retailPrice: number;
    regularPrice: number;
    accountNumber: string;
    bankName: string;
    accountName: string;
    user: Types.ObjectId;
}

const merchantSchema = new Schema<IMerchant>(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        address: { type: String, required: false },
        storeName: { type: String, required: false },
        isOpened: { type: Boolean, default: true },
        retailPrice: { type: Number, required: false },
        regularPrice: { type: Number, required: false },
        accountNumber: String,
        bankName: String,
        accountName: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true
    }
);

const Merchant = mongoose.model<IMerchant>("Merchant", merchantSchema);
export default Merchant;
