"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const refillStatus_1 = require("../enum/refillStatus");
const refillScheduleSchema = new mongoose_1.Schema({
    gas: { type: mongoose_1.Schema.Types.ObjectId, ref: "Gas" },
    pickedUpTime: { type: String },
    quantity: { type: Number, required: true },
    address: { type: String, required: true },
    price: { type: Number },
    deliveryFee: { type: Number },
    paymentMethod: { type: String },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: refillStatus_1.RefillStatus.PENDING, enum: Object.values(refillStatus_1.RefillStatus) },
    gcode: { type: String },
    gasStation: { type: mongoose_1.Schema.Types.ObjectId, ref: "GasStation" },
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "Rider" },
    timeScheduled: { type: Date, default: new Date() }
}, {
    timestamps: true
});
// Pre-save middleware to generate the gcode
refillScheduleSchema.pre("save", function (next) {
    if (!this.gcode) {
        // Generate a gcode like "G382B"
        const randomPart = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
        this.gcode = `G${randomPart}`;
    }
    this.timeScheduled = new Date();
    next();
});
// Create the RefillSchedule model
const RefillSchedule = mongoose_1.default.model("RefillSchedule", refillScheduleSchema);
exports.default = RefillSchedule;
