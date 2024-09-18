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
const typedi_1 = require("typedi");
const gas_1 = __importDefault(require("../models/gas"));
require("reflect-metadata");
const mongoose_1 = require("mongoose");
let GasRepository = class GasRepository {
    constructor(model = gas_1.default) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new this.model(data).save();
            return result;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findById(id);
            return result;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.find();
            return result;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndUpdate(id, data, { new: true });
            return result;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndDelete(id);
            return result;
        });
    }
    findByAppliance(appliance) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne({ primaryCookingAppliance: appliance });
            return result;
        });
    }
    findByOwner(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findOne({ ownedBy: ownerId }).populate("ownedBy");
            return result;
        });
    }
    // Method to track usage by day
    trackUsageByDay(gasId, day, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(year, month - 1, day);
            const endDate = new Date(year, month - 1, day + 1);
            const gas = yield this.model.aggregate([
                { $match: { _id: gasId } },
                { $unwind: '$usage' },
                {
                    $match: {
                        'usage.usedAt': { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: '$size',
                        totalUsage: { $sum: '$usage.amountUsed' },
                        usageDetails: { $push: '$usage' }
                    }
                }
            ]);
            return gas;
        });
    }
    // Get daily usage within a specific month
    getDailyUsage(userId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
            return this.model.aggregate([
                { $match: { ownedBy: new mongoose_1.Types.ObjectId(userId), 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
                { $unwind: '$usage' },
                { $match: { 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
                { $sort: { 'usage.usedAt': 1 } },
                {
                    $group: {
                        _id: { day: { $dayOfMonth: '$usage.usedAt' }, month: { $month: '$usage.usedAt' }, year: { $year: '$usage.usedAt' } },
                        usage: { $push: '$usage' },
                    },
                },
                { $sort: { '_id.day': 1 } },
            ]);
        });
    }
    // Get weekly usage within a specific month
    getWeeklyUsage(userId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
            return this.model.aggregate([
                { $match: { ownedBy: new mongoose_1.Types.ObjectId(userId), 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
                { $unwind: '$usage' },
                { $match: { 'usage.usedAt': { $gte: startOfMonth, $lte: endOfMonth } } },
                { $sort: { 'usage.usedAt': 1 } },
                {
                    $group: {
                        _id: { week: { $week: '$usage.usedAt' }, year: { $year: '$usage.usedAt' } },
                        usage: { $push: '$usage' },
                    },
                },
                { $sort: { '_id.week': 1 } },
            ]);
        });
    }
    // Get monthly usage within a specific year
    getMonthlyUsage(userId, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
            return this.model.aggregate([
                { $match: { ownedBy: new mongoose_1.Types.ObjectId(userId), 'usage.usedAt': { $gte: startOfYear, $lte: endOfYear } } },
                { $unwind: '$usage' },
                { $match: { 'usage.usedAt': { $gte: startOfYear, $lte: endOfYear } } },
                { $sort: { 'usage.usedAt': 1 } },
                {
                    $group: {
                        _id: { month: { $month: '$usage.usedAt' }, year: { $year: '$usage.usedAt' } },
                        usage: { $push: '$usage' },
                    },
                },
                { $sort: { '_id.month': 1 } },
            ]);
        });
    }
    updateGasLevel(id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndUpdate(id, { level }, { new: true });
        });
    }
};
GasRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [Object])
], GasRepository);
exports.default = GasRepository;
