import mongoose, { Schema, Document, Types } from 'mongoose';

// Define an interface for the Notification model
export interface INotification extends Document {
  userId: Types.ObjectId;
  message: string;
  action: string;
  actionLabel: string;
  notificationType: string;
  read: boolean;
  createdAt: Date;
}

// Define the Notification schema
const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  action: { type: String, default: null }, // e.g., URL to track an order or refill
  actionLabel: { type: String, default: null }, // e.g., "Refill Now", "Track Order"
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  notificationType: {type: String}
}, {
  timestamps: true
});

// Create the Notification model
const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
