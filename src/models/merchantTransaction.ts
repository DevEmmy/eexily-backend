import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMerchantTransactions extends Document {
  merchantId: Types.ObjectId | string;
  amount: number;
  details: Record<string, any>;
  transactionDate: Date;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionType: 'CREDIT' | 'DEBIT';
  referenceNumber: string;
}

const merchantTransactionSchema = new Schema<IMerchantTransactions>({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  amount: { type: Number, required: true },
  details: { type: mongoose.SchemaTypes.Mixed, default: {} },
  transactionDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  transactionType: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  referenceNumber: { type: String, unique: true, required: true }
},
{
  timestamps: true
});

const MerchantTransactions = mongoose.model<IMerchantTransactions>('MerchantTransactions', merchantTransactionSchema);
export default MerchantTransactions;