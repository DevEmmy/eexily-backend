"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrequentRefillPerMonth = exports.GenderComposition = exports.TypeOfHouseHold = exports.HouseHoldSize = exports.TypeOfCooking = exports.DailyMeals = exports.FrequentUsage = exports.AmountValue = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define enums
var AmountValue;
(function (AmountValue) {
    AmountValue[AmountValue["ONE"] = 1] = "ONE";
    AmountValue[AmountValue["TWO"] = 2] = "TWO";
    AmountValue[AmountValue["THREE"] = 3] = "THREE";
    AmountValue[AmountValue["SIX"] = 6] = "SIX";
    AmountValue[AmountValue["TWELVE"] = 12] = "TWELVE";
    AmountValue[AmountValue["TWENTY_FIVE"] = 25] = "TWENTY_FIVE";
    AmountValue[AmountValue["FIFTY"] = 50] = "FIFTY";
})(AmountValue = exports.AmountValue || (exports.AmountValue = {}));
var FrequentUsage;
(function (FrequentUsage) {
    FrequentUsage["FOUR_TO_SIX"] = "4-6";
    FrequentUsage["ONE_TO_THREE"] = "1-3";
    FrequentUsage["LESS_THAN_ONCE_A_WEEK"] = "Less than once a week";
})(FrequentUsage = exports.FrequentUsage || (exports.FrequentUsage = {}));
var DailyMeals;
(function (DailyMeals) {
    DailyMeals["ONE"] = "1";
    DailyMeals["TWO"] = "2";
    DailyMeals["THREE"] = "3";
    DailyMeals["MORE_THAN_THREE"] = "more than 3";
})(DailyMeals = exports.DailyMeals || (exports.DailyMeals = {}));
var TypeOfCooking;
(function (TypeOfCooking) {
    TypeOfCooking["LIGHT"] = "Light";
    TypeOfCooking["MODERATE"] = "Moderate";
    TypeOfCooking["HEAVY"] = "Heavy";
})(TypeOfCooking = exports.TypeOfCooking || (exports.TypeOfCooking = {}));
var HouseHoldSize;
(function (HouseHoldSize) {
    HouseHoldSize["ONE"] = "1";
    HouseHoldSize["TWO_TO_THREE"] = "2-3";
    HouseHoldSize["FOUR_TO_FIVE"] = "4-5";
    HouseHoldSize["MORE_THAN_FIVE"] = "more than 5";
})(HouseHoldSize = exports.HouseHoldSize || (exports.HouseHoldSize = {}));
var TypeOfHouseHold;
(function (TypeOfHouseHold) {
    TypeOfHouseHold["FAMILY"] = "Family";
    TypeOfHouseHold["SHARED"] = "Shared";
    TypeOfHouseHold["SINGLE"] = "Single";
})(TypeOfHouseHold = exports.TypeOfHouseHold || (exports.TypeOfHouseHold = {}));
var GenderComposition;
(function (GenderComposition) {
    GenderComposition["ALL_FAMILY"] = "All Family";
    GenderComposition["ALL_MALE"] = "All Male";
    GenderComposition["MIXED"] = "Mixed";
})(GenderComposition = exports.GenderComposition || (exports.GenderComposition = {}));
var FrequentRefillPerMonth;
(function (FrequentRefillPerMonth) {
    FrequentRefillPerMonth["ONE"] = "1";
    FrequentRefillPerMonth["TWO_TO_THREE"] = "2-3";
    FrequentRefillPerMonth["FOUR_TIMES_OR_MORE"] = "4 times or more";
})(FrequentRefillPerMonth = exports.FrequentRefillPerMonth || (exports.FrequentRefillPerMonth = {}));
// Define the schema
const gasPredictionSchema = new mongoose_1.Schema({
    amountValue: { type: Number, enum: Object.values(AmountValue), required: true },
    daysofUse: { type: Number, required: true },
    frequentUsage: { type: String, enum: Object.values(FrequentUsage), required: true },
    dailyMeals: { type: String, enum: Object.values(DailyMeals), required: true },
    typeOfCooking: { type: String, enum: Object.values(TypeOfCooking), required: true },
    houseHoldSize: { type: String, enum: Object.values(HouseHoldSize), required: true },
    typeOfHouseHold: { type: String, enum: Object.values(TypeOfHouseHold), required: true },
    genderComposition: { type: String, enum: Object.values(GenderComposition), required: true },
    usageAsideCooking: { type: Boolean, required: true },
    isOvenUsage: { type: Boolean, required: true },
    frequentRefillPerMonth: { type: String, enum: Object.values(FrequentRefillPerMonth), required: true },
    lastRefill: { type: Date, required: true }
});
// Define the model
const GasPrediction = mongoose_1.default.model('GasPrediction', gasPredictionSchema);
exports.default = GasPrediction;
