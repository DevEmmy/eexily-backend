import mongoose, { Schema, Types, Document } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";

export interface IExpressRefill extends Document {
  gas: Types.ObjectId | string;
  pickupDate: Date;
  quantity: number;
  address: string;
  price: number;
  deliveryFee: number;
  paymentMethod: string;
  user: Types.ObjectId | string;
  merchant: Types.ObjectId | string;
  status: string;
  gcode: string;
  rider: Types.ObjectId | string;
  timeScheduled: Date;
}

const expressRefillSchema = new Schema<IExpressRefill>(
  {
    gas: { type: Schema.Types.ObjectId, ref: "Gas", required: true },
    pickupDate: { type: Date, required: true }, // Changed to Date type
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: RefillStatus.PENDING, enum: Object.values(RefillStatus) },
    gcode: { type: String },
    merchant: { type: Schema.Types.ObjectId, ref: "Merchant", required: true },
    rider: { type: Schema.Types.ObjectId, ref: "Rider" },
    timeScheduled: { type: Date, default: new Date() }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to generate the gcode and update the scheduled time
expressRefillSchema.pre("save", function (next) {
  if (!this.gcode) {
    // Generate a gcode like "G382B"
    const randomPart = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    this.gcode = `G${randomPart}`;
  }
  if (!this.timeScheduled) {
    this.timeScheduled = new Date();
  }
  next();
});

// Create the ExpressRefill model
const ExpressRefill = mongoose.model<IExpressRefill>("ExpressRefill", expressRefillSchema);
export default ExpressRefill;
