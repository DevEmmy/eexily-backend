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
const RefillScheduleRepository_1 = __importDefault(require("../repositories/RefillScheduleRepository"));
const refillStatus_1 = require("../enum/refillStatus");
const refillSchedule_1 = __importDefault(require("../models/refillSchedule"));
const GasStationRepository_1 = __importDefault(require("../repositories/GasStationRepository"));
const RiderRepository_1 = __importDefault(require("../repositories/RiderRepository"));
let RSServices = class RSServices {
    constructor(repo, gasStationRepo, riderRepo) {
        this.repo = repo;
        this.gasStationRepo = gasStationRepo;
        this.riderRepo = riderRepo;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = yield this.repo.create(data);
                this.processSchedule(data).catch(err => {
                    console.error("Error in processSchedule:", err);
                });
                return {
                    payload
                };
            }
            catch (err) {
                return {
                    message: "Schedule not found"
                };
            }
        });
    }
    getByGcode(gcode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = yield this.repo.getByGcode(gcode);
                if (!payload) {
                    return {
                        message: "Schedule not found"
                    };
                }
                return {
                    payload
                };
            }
            catch (err) {
                return {
                    message: "Schedule not found"
                };
            }
        });
    }
    getByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = yield this.repo.getRefillScheduleByUser(user);
            return { payload };
        });
    }
    updateScheduleStatus(_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = yield this.repo.update(_id, { status });
                return { payload };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    getRefillScheduleByStatus(status, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = yield this.repo.getRefillScheduleByStatus(status, user);
                return { payload };
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
    }
    processSchedule(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Assigning Schedule");
                let schedule = yield this.repo.findOne({ _id: data._id });
                //dont forget to filter by the time 
                if (!schedule) {
                    return { message: "schedule not found" };
                }
                //fetch all drivers
                let drivers = yield this.riderRepo.find({ gasStation: schedule === null || schedule === void 0 ? void 0 : schedule.gasStation });
                let status = false;
                for (let i = 0; i <= drivers.length; i++) {
                    let driver = drivers[i];
                    const createdTime = new Date(String(data.timeScheduled));
                    const day = createdTime.getDate();
                    const month = createdTime.getMonth() + 1; // Months are zero-indexed in JavaScript
                    const year = createdTime.getFullYear();
                    let schedulesForDriver = yield refillSchedule_1.default.aggregate([
                        {
                            $match: {
                                rider: drivers[i],
                                $expr: {
                                    $and: [
                                        { $eq: [{ $dayOfMonth: "$createdAt" }, day] },
                                        { $eq: [{ $month: "$createdAt" }, month] },
                                        { $eq: [{ $year: "$createdAt" }, year] },
                                    ]
                                }
                            }
                        },
                        {
                            $match: { pickedUpTime: data["pickedUpTime"] } // Match the pickedUpTime if needed
                        }
                    ]);
                    if (schedulesForDriver.length < 20) {
                        schedule.rider = driver._id;
                        schedule.status = refillStatus_1.RefillStatus.MATCHED;
                        console.log("MATCHED");
                        yield this.repo.update({ _id: schedule._id }, schedule);
                        status = true;
                        break;
                    }
                    continue;
                }
                // send a notification out
                if (!status) {
                    console.log("No Available Driver");
                }
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getOrdersByRider(rider) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                payload: yield this.repo.find({ rider })
            };
        });
    }
    getOrdersByGasStation(gasStation) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                payload: yield this.repo.find({ gasStation })
            };
        });
    }
    updateStatusByStation(editor, gcode, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gasStation, user, rider } = editor;
                let schedule = yield this.repo.findOne({ gcode });
                if (!schedule) {
                    return {
                        message: "Schedule Not Found"
                    };
                }
                if (gasStation && (String(schedule.gasStation) != String(gasStation))) {
                    return {
                        message: "You cannot edit this status"
                    };
                }
                if (user && (String(schedule.user) != String(user))) {
                    return {
                        message: "You cannot edit this status"
                    };
                }
                if (rider && (String(schedule.rider) != String(rider))) {
                    return {
                        message: "You cannot edit this status"
                    };
                }
                if (!user || !gasStation || !rider) {
                    return {
                        message: "You cannot edit this status"
                    };
                }
                schedule.status = status;
                schedule = yield this.repo.update({ gcode }, schedule);
                return {
                    payload: schedule,
                    message: "Status Updated"
                };
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
};
RSServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [RefillScheduleRepository_1.default, GasStationRepository_1.default, RiderRepository_1.default])
], RSServices);
exports.default = RSServices;
