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
const CustomerServiceRepository_1 = __importDefault(require("../repositories/CustomerServiceRepository"));
let CustomerServiceServices = class CustomerServiceServices {
    constructor(repository) {
        this.repository = repository;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.create(data);
        });
    }
    getAllCustomers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find();
        });
    }
    updateCustomer(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let customer = yield this.repository.findOne({ user });
                if (!customer) {
                    return {
                        message: "Customer Service not Found"
                    };
                }
                let updatedData = yield this.repository.update({ user }, data);
                return {
                    payload: updatedData,
                    message: "Updated"
                };
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                payload: yield this.repository.findOne({ user })
            };
        });
    }
};
CustomerServiceServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [CustomerServiceRepository_1.default])
], CustomerServiceServices);
exports.default = CustomerServiceServices;
