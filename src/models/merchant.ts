import mongoose, { Schema, Document, Types } from 'mongoose';
import { gasPrices } from '../server';

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
    location: string,
    bankCode: string
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
        regularPrice: { type: Number, required: false, default: gasPrices.merchantGasPrice },
        accountNumber: String,
        bankName: String,
        bankCode: String,
        accountName: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        location: String
    },
    {
        timestamps: true
    }
);

const Merchant = mongoose.model<IMerchant>("Merchant", merchantSchema);
export default Merchant;
