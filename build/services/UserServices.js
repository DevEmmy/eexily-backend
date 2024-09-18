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
exports.UserServices = void 0;
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const bcrypt_1 = __importDefault(require("bcrypt"));
require("reflect-metadata");
const typedi_1 = require("typedi");
const GasRepository_1 = __importDefault(require("../repositories/GasRepository"));
const OtpServices_1 = require("./OtpServices");
const userTypes_1 = require("../enum/userTypes");
const BusinessServices_1 = __importDefault(require("./BusinessServices"));
const CustomerServiceServices_1 = __importDefault(require("./CustomerServiceServices"));
const GasStationServices_1 = __importDefault(require("./GasStationServices"));
const IndividualServices_1 = __importDefault(require("./IndividualServices"));
const RiderServices_1 = __importDefault(require("./RiderServices"));
let jwtSecret = process.env.JWT_SECRET;
let UserServices = class UserServices {
    constructor(repo, gasRepo, otpService, businessServices, csServices, gsServices, individualServices, riderServices) {
        this.repo = repo;
        this.gasRepo = gasRepo;
        this.otpService = otpService;
        this.businessServices = businessServices;
        this.csServices = csServices;
        this.gsServices = gsServices;
        this.individualServices = individualServices;
        this.riderServices = riderServices;
    }
    ;
    generateToken(id) {
        let token = jsonwebtoken_1.default.sign({ id }, jwtSecret);
        return token;
    }
    signUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password, type } = data;
                // let { size, houseHoldSize, primaryCookingAppliance } = data;
                let checkUser = yield this.repo.findByEmail(email);
                if (checkUser) {
                    return { message: "User with this email already exists." };
                }
                data.password = yield bcrypt_1.default.hash(password, 8);
                let otp = this.otpService.generateOTP();
                data.generatedOtp = yield bcrypt_1.default.hash(String(otp), 8);
                //set date
                const currentDate = new Date();
                data.generatedOtpExpiration = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
                let user = yield this.repo.create(data);
                //send otp
                yield this.otpService.sendCreateUserOTP(otp, email);
                let typeData = {
                    user
                };
                switch (type) {
                    case userTypes_1.UserType.BUSINESS:
                        yield this.businessServices.createBusiness(typeData);
                    case userTypes_1.UserType.RIDER:
                        yield this.riderServices.create(typeData);
                    case userTypes_1.UserType.CUSTOMER_SERVICE:
                        yield this.csServices.create(typeData);
                    case userTypes_1.UserType.GAS_STATION:
                        yield this.gsServices.create(typeData);
                    case userTypes_1.UserType.INDIVIDUAL:
                        yield this.individualServices.create(typeData);
                        break;
                    default:
                        yield this.individualServices.create(typeData);
                        break;
                }
                // let gasObject: GasDto = { size, houseHoldSize, primaryCookingAppliance, ownedBy: String(user._id) };
                // let gas = await this.gasRepo.create(gasObject)
                return {
                    payload: { user }
                };
            }
            catch (err) {
                throw Error(err.message);
            }
        });
    }
    verifyOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.repo.findByEmail(email);
                if (!user) {
                    return {
                        payload: null,
                        message: "Email not found"
                    };
                }
                // if (user.generatedOtpExpiration > new Date()) {
                //     return {
                //         payload: null,
                //         message: "OTP Expired"
                //     }
                // }
                let doMatch = yield bcrypt_1.default.compare(String(otp), user.generatedOtp);
                if (!doMatch) {
                    return { message: "Incorrect OTP", payload: null };
                }
                user.isVerified = true;
                user.generatedOtp = null;
                user.generatedOtpExpiration = null;
                user = yield this.repo.update(user._id, user);
                let gas = yield this.gasRepo.findByOwner(user._id);
                let token = this.generateToken(String(user._id));
                return {
                    payload: { user, gas, token }
                };
            }
            catch (err) {
                throw Error(err.message);
            }
        });
    }
    signIn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = data;
                let user = yield this.repo.findByEmail(email);
                if (!user) {
                    return { message: "User with this email does not exist" };
                }
                if (user.isVerified !== true) {
                    return { payload: null, message: "You're not verified yet!" };
                }
                let doMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!doMatch) {
                    return { message: "Incorrect Password" };
                }
                let token = this.generateToken(String(user._id));
                return {
                    payload: { user, token }
                };
            }
            catch (err) {
                throw Error(err.message);
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    completeProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repo.findById(userId);
            data.user = user;
            let result;
            switch (user === null || user === void 0 ? void 0 : user.type) {
                case userTypes_1.UserType.BUSINESS:
                    result = yield this.businessServices.createBusiness(data);
                    break;
                case userTypes_1.UserType.CUSTOMER_SERVICE:
                    result = yield this.csServices.create(data);
                    break;
                case userTypes_1.UserType.GAS_STATION:
                    result = yield this.gsServices.create(data);
                    break;
                case userTypes_1.UserType.INDIVIDUAL:
                    result = yield this.individualServices.create(data);
                    break;
                case userTypes_1.UserType.RIDER:
                    result = yield this.riderServices.create(data);
                    break;
                default:
                    result = null;
                    break;
            }
            return {
                payload: result,
                message: "Completed Successfully"
            };
        });
    }
};
UserServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [UserRepository_1.default, GasRepository_1.default, OtpServices_1.OTPServices, BusinessServices_1.default, CustomerServiceServices_1.default, GasStationServices_1.default, IndividualServices_1.default, RiderServices_1.default])
], UserServices);
exports.UserServices = UserServices;
