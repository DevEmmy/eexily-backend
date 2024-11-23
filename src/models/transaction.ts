import mongoose, { Schema, Types, Document } from "mongoose";

export interface ITransaction extends Document {
  user: Types.ObjectId | string;
  merchant: Types.ObjectId | string;
  rider?: Types.ObjectId | string;
  amount: number;
  status: "pending" | "success" | "failed";
  reference: string;
  paymentGateway: "paystack";
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    merchant: { type: Schema.Types.ObjectId, ref: "Merchant", required: true },
    rider: { type: Schema.Types.ObjectId, ref: "Rider" },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    reference: { type: String, required: true, unique: true },
    paymentGateway: { type: String, default: "paystack" }
  },
  { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
export default Transaction;