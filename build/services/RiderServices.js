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
const RiderRepository_1 = __importDefault(require("../repositories/RiderRepository"));
const GasStationRepository_1 = __importDefault(require("../repositories/GasStationRepository"));
const RefillScheduleRepository_1 = __importDefault(require("../repositories/RefillScheduleRepository"));
let RiderServices = class RiderServices {
    constructor(repository, gasStationRepo, refillScheduleRepo) {
        this.repository = repository;
        this.gasStationRepo = gasStationRepo;
        this.refillScheduleRepo = refillScheduleRepo;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let gasStation = yield this.gasStationRepo.getByRegCode(data.gasStationCode);
            if (!gasStation) {
                return {
                    message: "Gas Station Not Found"
                };
            }
            data.gasStation = gasStation._id;
            let payload = yield this.repository.create(data);
            return { payload };
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = yield this.repository.find();
            return { payload };
        });
    }
    getRiderByGasStation(gasStation) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = yield this.repository.find({ gasStation });
            return { payload };
        });
    }
    getRiderSchedule(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let schedules = yield this.refillScheduleRepo.find({ rider: _id });
            return { payload: schedules };
        });
    }
    update(_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = yield this.refillScheduleRepo.update({ _id }, data);
            return { payload };
        });
    }
};
RiderServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [RiderRepository_1.default, GasStationRepository_1.default, RefillScheduleRepository_1.default])
], RiderServices);
exports.default = RiderServices;
