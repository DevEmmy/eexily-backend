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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const NotificationRepository_1 = __importDefault(require("../repositories/NotificationRepository"));
let notificationRepo = new NotificationRepository_1.default();
// Define the Usage schema
const UsageSchema = new mongoose_1.Schema({
    amountUsed: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now },
    description: { type: String, default: '' }
}, {
    timestamps: true
});
// Define the Gas schema
const GasSchema = new mongoose_1.Schema({
    size: { type: String, required: true },
    ownedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    lastFilled: { type: Date, default: null },
    level: { type: Number, default: 100 },
    usage: { type: [UsageSchema], default: [] } // Initialize usage as an empty array
}, {
    timestamps: true
});
GasSchema.post('save', function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc.level <= 20) {
            console.log(`Gas level low: ${doc.level}%`);
            // Trigger notification for low gas level
            yield notificationRepo.sendNotification(doc.ownedBy, 'low');
        }
        else if (doc.level <= 50) {
            console.log(`Gas level at average: ${doc.level}%`);
            // Trigger notification for average gas level
            yield notificationRepo.sendNotification(doc.ownedBy, 'average');
        }
        else if (doc.level === 100) {
            console.log(`Gas filled up: ${doc.level}%`);
            // Trigger notification for gas filled up
            yield notificationRepo.sendNotification(doc.ownedBy, 'full');
        }
    });
});
// Create the Gas model
const Gas = mongoose_1.default.model('Gas', GasSchema);
exports.default = Gas;
