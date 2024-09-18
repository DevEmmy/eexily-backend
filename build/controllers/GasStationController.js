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
const response_1 = require("../utils/response");
const GasStationServices_1 = __importDefault(require("../services/GasStationServices"));
let GasStationController = class GasStationController {
    constructor(service) {
        this.service = service;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let { payload } = yield this.service.create(data);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { userId } = req.params;
                let { payload } = yield this.service.getGasStationByUser(userId);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getByRegcode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { regCode } = req.params;
                let { payload } = yield this.service.getByRegCode(regCode);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let { id } = req.params;
                let { payload } = yield this.service.update(id, data);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getAll(req, res) {
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
};
GasStationController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [GasStationServices_1.default])
], GasStationController);
exports.default = GasStationController;
