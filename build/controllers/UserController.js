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
exports.UserController = void 0;
const typedi_1 = require("typedi");
require("reflect-metadata");
const UserServices_1 = require("../services/UserServices");
const response_1 = require("../utils/response");
let UserController = class UserController {
    constructor(service) {
        this.service = service;
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                let { payload, message } = yield this.service.signUp(body);
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
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log(body);
                let { payload, message } = yield this.service.signIn(body);
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
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email } = req.body;
                let { payload, message } = yield this.service.verifyOtp(otp, email);
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
    getLoggedInUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req.body;
                // return success(payload, res);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
    completeRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { type, email, _id } = req.body.user;
                let { payload, message } = yield this.service.completeProfile(_id, body);
                if (!payload && message) {
                    return (0, response_1.error)(message, res, 400);
                }
                return (0, response_1.success)(payload, res, message);
            }
            catch (err) {
                (0, response_1.error)(err.message, res, err.status || 400);
            }
        });
    }
};
UserController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [UserServices_1.UserServices])
], UserController);
exports.UserController = UserController;
