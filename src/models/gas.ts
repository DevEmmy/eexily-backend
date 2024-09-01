import mongoose, { Schema, Document, Types } from 'mongoose';
import NotificationRepository from '../repositories/NotificationRepository';


let notificationRepo = new NotificationRepository();
// Define an interface for the Usage model
export interface IUsage extends Document {
  amountUsed: number;
  usedAt: Date;
  description: string;
}

// Define the Usage schema
const UsageSchema = new Schema<IUsage>({
  amountUsed: { type: Number, required: true },
  usedAt: { type: Date, default: Date.now },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

// Define an interface for the Gas model
export interface IGas extends Document {
  size: string;
  ownedBy: Types.ObjectId;
  lastFilled: Date;
  level: number;
  usage: Types.DocumentArray<IUsage>;  // Adding usage as an array of IUsage documents
}

// Define the Gas schema
const GasSchema = new Schema<IGas>({
  size: { type: String, required: true },
  ownedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lastFilled: { type: Date, default: null },
  level: { type: Number, default: 100 },
  usage: { type: [UsageSchema], default: [] }  // Initialize usage as an empty array
}, {
  timestamps: true
});

GasSchema.post('save', async function (doc: IGas) {
  if (doc.level <= 20) {
    console.log(`Gas level low: ${doc.level}%`);
    // Trigger notification for low gas level
    await notificationRepo.sendNotification(doc.ownedBy, 'low');
  } else if (doc.level <= 50) {
    console.log(`Gas level at average: ${doc.level}%`);
    // Trigger notification for average gas level
    await notificationRepo.sendNotification(doc.ownedBy, 'average');
  } else if (doc.level === 100) {
    console.log(`Gas filled up: ${doc.level}%`);
    // Trigger notification for gas filled up
    await notificationRepo.sendNotification(doc.ownedBy, 'full');
  }
});

// Create the Gas model
const Gas = mongoose.model<IGas>('Gas', GasSchema);
export default Gas;
