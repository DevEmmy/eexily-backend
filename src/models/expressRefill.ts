import mongoose, { Schema, Types, Document } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";

export enum SellerType {
  GAS_STATION = "GAS_STATION",
  MERCHANT = "MERCHANT",
}

export interface IStatusHistory {
  status: string;
  updatedAt: Date;
}

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
  gasStation: Types.ObjectId | string;
  timeScheduled: Date;
  sellerType: string;
  statusHistory: IStatusHistory[];
}

const expressRefillSchema = new Schema<IExpressRefill>(
  {
    sellerType: { type: String, enum: Object.values(SellerType), default: SellerType.MERCHANT },
    gas: { type: Schema.Types.ObjectId, ref: "Gas", required: false },
    pickupDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      default: RefillStatus.PENDING,
      enum: Object.values(RefillStatus),
    },
    gcode: { type: String },
    merchant: { type: Schema.Types.ObjectId, ref: "Merchant", required: true },
    rider: { type: Schema.Types.ObjectId, ref: "Rider" },
    timeScheduled: { type: Date, default: new Date() },
    gasStation: { type: Schema.Types.ObjectId, ref: "GasStation" },
    statusHistory: [
      {
        status: { type: String, enum: Object.values(RefillStatus), required: true },
        updatedAt: { type: Date, required: true, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate the gcode and update the scheduled time
expressRefillSchema.pre("save", function (next) {
  if (!this.gcode) {
    const randomPart = Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
    this.gcode = `G${randomPart}`;
  }
  if (!this.timeScheduled) {
    this.timeScheduled = new Date();
  }

  // Add the initial status to the statusHistory
  if (this.isNew && !this.statusHistory.length) {
    this.statusHistory.push({ status: this.status, updatedAt: new Date() });
  }

  next();
});

// Middleware to add new status updates to statusHistory
expressRefillSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<IExpressRefill>;

  if (update.status) {
    const statusHistoryUpdate = {
      status: update.status,
      updatedAt: new Date(),
    };

    this.setUpdate({
      $push: { statusHistory: statusHistoryUpdate },
      ...update,
    });
  }

  next();
});

// Create the ExpressRefill model
const ExpressRefill = mongoose.model<IExpressRefill>(
  "ExpressRefill",
  expressRefillSchema
);
export default ExpressRefill;
