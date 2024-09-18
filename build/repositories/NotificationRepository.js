"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const mongoose_1 = require("mongoose");
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
const BaseRepository_1 = require("./BaseRepository");
const typedi_1 = require("typedi");
let NotificationRepository = class NotificationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(notification_1.default);
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(notificationId, { read: true }, { new: true });
        });
    }
    getUserNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find({ userId, read: false }).sort({ createdAt: -1 });
        });
    }
    sendNotification(userId, level) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                let message = '';
                let action = '';
                let actionLabel = '';
                let notificationType = '';
                // Customize the notification based on the gas level
                switch (level) {
                    case 'low':
                        message = `Hello ${user.firstName}, your gas level is currently low.`;
                        notificationType = 'low';
                        action = '/refill'; // Hypothetical URL or action
                        actionLabel = 'Refill Now';
                        break;
                    case 'average':
                        message = `Hello ${user.firstName}, your gas level is at 50%.`;
                        notificationType = 'average';
                        action = ''; // No action necessary
                        actionLabel = '';
                        break;
                    case 'full':
                        message = `Hello ${user.firstName}, your gas tank is fully filled.`;
                        notificationType = 'full';
                        action = ''; // No action necessary
                        actionLabel = '';
                        break;
                    default:
                        throw new Error('Unknown gas level');
                }
                // Save the notification to the database
                const notification = new notification_1.default({
                    userId: user._id,
                    message,
                    action,
                    actionLabel,
                    read: false,
                    createdAt: new Date()
                });
                yield notification.save();
                // Optionally, send push notifications
                yield this.create({
                    userId: new mongoose_1.Types.ObjectId(user._id),
                    // title: 'Gas Level Update',
                    message,
                    notificationType,
                    actionLabel
                });
                console.log(`Notification sent and saved for user ${user.firstName} regarding gas level: ${level}`);
            }
            catch (error) {
                console.error('Error sending notification:', error);
            }
        });
    }
};
NotificationRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], NotificationRepository);
exports.default = NotificationRepository;
