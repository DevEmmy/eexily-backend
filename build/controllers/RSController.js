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
const RefillScheduleServices_1 = __importDefault(require("../services/RefillScheduleServices"));
const response_1 = require("../utils/response");
let RSController = class RSController {
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
                let { payload } = yield this.service.getByUser(userId);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getByGCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { gcode } = req.params;
                let { payload } = yield this.service.getByGcode(gcode);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    updateRefillSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { status } = req.body;
                let { id } = req.params;
                let { payload } = yield this.service.updateScheduleStatus(id, status);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    updateRefillStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let body = req.body;
                let { id } = req.params;
                let { payload } = yield this.service.updateStatusByStation(body.editor, body.status, body.status);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    getRefillScheduleByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { status } = req.params;
                let { payload } = yield this.service.getRefillScheduleByStatus(status);
                return (0, response_1.success)(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
};
RSController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [RefillScheduleServices_1.default])
], RSController);
exports.default = RSController;
