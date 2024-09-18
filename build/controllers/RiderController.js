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
exports.RiderController = void 0;
const typedi_1 = require("typedi");
require("reflect-metadata");
const response_1 = require("../utils/response");
const RiderServices_1 = __importDefault(require("../services/RiderServices"));
let RiderController = class RiderController {
    constructor(service) {
        this.service = service;
    }
    createRider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                let { payload, message } = yield this.service.create(body);
                if (!payload && message) {
                    return (0, response_1.error)(message, res, 400);
                }
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getAllRiders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { payload } = yield this.service.getAll();
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getRidersByGasStation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gasStation } = req.params;
                let { payload } = yield this.service.getRiderByGasStation(gasStation);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getRiderSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { riderId } = req.params;
                let { payload } = yield this.service.getRiderSchedule(riderId);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    updateRider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { riderId } = req.params;
                const body = req.body;
                let { payload } = yield this.service.update(riderId, body);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
};
RiderController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [RiderServices_1.default])
], RiderController);
exports.RiderController = RiderController;
exports.default = RiderController;
