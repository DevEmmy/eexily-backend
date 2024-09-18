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
exports.GasServices = void 0;
require("reflect-metadata");
const typedi_1 = require("typedi");
const pdfkit_1 = __importDefault(require("pdfkit"));
const GasRepository_1 = __importDefault(require("../repositories/GasRepository"));
let GasServices = class GasServices {
    constructor(repo) {
        this.repo = repo;
    }
    createGas(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gas = yield this.repo.create(data);
                return {
                    message: "Gas record created successfully",
                    payload: gas
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getGasById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gas = yield this.repo.findById(id);
                if (!gas) {
                    return { message: "Gas record not found" };
                }
                return {
                    message: "Gas record fetched successfully",
                    payload: gas
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getAllGas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gases = yield this.repo.findAll();
                return {
                    message: "All gas records fetched successfully",
                    payload: gases
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateGas(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gas = yield this.repo.update(id, data);
                if (!gas) {
                    return { message: "Gas record not found" };
                }
                return {
                    message: "Gas record updated successfully",
                    payload: gas
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    deleteGasById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gas = yield this.repo.deleteById(id);
                if (!gas) {
                    return { message: "Gas record not found" };
                }
                return {
                    message: "Gas record deleted successfully",
                    payload: gas
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    findGasByAppliance(appliance) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gas = yield this.repo.findByAppliance(appliance);
                if (!gas) {
                    return { message: "Gas record not found" };
                }
                return {
                    message: "Gas record fetched successfully",
                    payload: gas
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getGasByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield this.repo.findByOwner(userId);
                return {
                    payload
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    updateGasLevel(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let gas = yield this.repo.findById(id);
                if (!gas) {
                    return {
                        message: "Gas not Found"
                    };
                }
                gas.usage.push(data);
                gas.level = gas.level - data.amountUsed;
                let payload = yield this.repo.update(id, gas);
                return {
                    payload
                };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getUsageData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, type, year, month, day } = params;
            let result;
            switch (type) {
                case 'daily':
                    if (month && day) {
                        result = yield this.repo.trackUsageByDay(userId, day, month, year);
                    }
                    else {
                        throw new Error('Month and Day are required for daily usage.');
                    }
                    break;
                case 'weekly':
                    if (month) {
                        result = yield this.repo.getWeeklyUsage(userId, month, year);
                    }
                    else {
                        throw new Error('Month is required for weekly usage.');
                    }
                    break;
                case 'monthly':
                    result = yield this.repo.getMonthlyUsage(userId, year);
                    break;
                default:
                    throw new Error('Invalid usage type. Please use "daily", "weekly", or "monthly".');
            }
            if (result.length > 0) {
                let pdfBuffer = yield this.generateUsagePdf(result, params);
                return {
                    payload: result,
                    pdfBuffer,
                    message: "Successful"
                };
            }
            return { payload: result, message: "No Usage" };
        });
    }
    generateUsagePdf(data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = new pdfkit_1.default();
            const pdfBuffer = yield new Promise(resolve => {
                const bufferChunks = [];
                doc.on('data', chunk => bufferChunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(bufferChunks)));
                doc.fontSize(16).text(`Gas Usage Report (${params.type} - ${params.year})`, { align: 'center' });
                doc.moveDown();
                data.forEach((item) => {
                    doc.fontSize(12).text(`- ${JSON.stringify(item)}`);
                    doc.moveDown();
                });
                doc.end();
            });
            return pdfBuffer;
        });
    }
};
GasServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [GasRepository_1.default])
], GasServices);
exports.GasServices = GasServices;
exports.default = GasServices;
