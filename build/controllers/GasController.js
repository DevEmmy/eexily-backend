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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasController = void 0;
const typedi_1 = require("typedi");
require("reflect-metadata");
const GasServices_1 = require("../services/GasServices");
const response_1 = require("../utils/response");
let GasController = class GasController {
    constructor(service) {
        this.service = service;
    }
    createGas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { payload, message } = yield this.service.createGas(body);
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
    getGasById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { payload, message } = yield this.service.getGasById(id);
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
    getAllGas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { payload, message } = yield this.service.getAllGas();
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
    updateGas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const body = req.body;
                const { payload, message } = yield this.service.updateGas(id, body);
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
    deleteGasById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { payload, message } = yield this.service.deleteGasById(id);
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
    findGasByAppliance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appliance } = req.params;
                const { payload, message } = yield this.service.findGasByAppliance(appliance);
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
    updateGasLevel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const body = req.body;
                const { payload, message } = yield this.service.updateGasLevel(id, body);
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
    getGasUsage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { payload, message, pdfBuffer } = yield this.service.getUsageData(body);
                if (!payload && message) {
                    return (0, response_1.error)(message, res, 400);
                }
                return res.json({ message, payload, pdfBuffer });
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
};
GasController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [GasServices_1.GasServices])
], GasController);
exports.GasController = GasController;
exports.default = GasController;
