import mongoose, { Schema, Types, Document } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";

export interface IRefillSchedule extends Document {
  gas: Types.ObjectId | string;
  pickedUpTime: Date;
  quantity: number;
  address: string;
  price: number;
  deliveryFee: number;
  paymentMethod: string;
  user: Types.ObjectId | string;
  status: string;
  gcode: string; 
}

const refillScheduleSchema = new Schema<IRefillSchedule>({
  gas: { type: Schema.Types.ObjectId, ref: "Gas" },
  pickedUpTime: { type: Date },
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  price: { type: Number },
  deliveryFee: { type: Number },
  paymentMethod: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: RefillStatus.PICK_UP, enum: Object.values(RefillStatus) },
  gcode: { type: String }
},
{
  timestamps: true
});

// Pre-save middleware to generate the gcode
refillScheduleSchema.pre("save", function (next) {
  if (!this.gcode) {
    // Generate a gcode like "G382B"
    const randomPart = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    this.gcode = `G${randomPart}`;
  }
  next();
});

// Create the RefillSchedule model
const RefillSchedule = mongoose.model<IRefillSchedule>("RefillSchedule", refillScheduleSchema);
export default RefillSchedule;
