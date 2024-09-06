import mongoose, { Schema, Types, Document } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";

export interface IRefillSchedule extends Document {
  gas: Types.ObjectId | string;
  pickedUpTime: "12PM" | "5PM";
  quantity: number;
  address: string;
  price: number;
  deliveryFee: number;
  paymentMethod: string;
  user: Types.ObjectId | string;
  gasStation: Types.ObjectId | string;
  status: string;
  gcode: string; 
  rider:  Types.ObjectId | string;
  timeScheduled : Date | string
}

const refillScheduleSchema = new Schema<IRefillSchedule>({
  gas: { type: Schema.Types.ObjectId, ref: "Gas" },
  pickedUpTime: { type: String },
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  price: { type: Number },
  deliveryFee: { type: Number },
  paymentMethod: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: RefillStatus.PENDING, enum: Object.values(RefillStatus) },
  gcode: { type: String },
  gasStation: {type: Schema.Types.ObjectId, ref: "GasStation"},
  rider: {type: Schema.Types.ObjectId, ref: "Rider"},
  timeScheduled : {type: Date, default: new Date()}
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
  this.timeScheduled = new Date()
  next();
});

// Create the RefillSchedule model
const RefillSchedule = mongoose.model<IRefillSchedule>("RefillSchedule", refillScheduleSchema);
export default RefillSchedule;