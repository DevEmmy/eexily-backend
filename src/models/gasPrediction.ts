import mongoose, { Schema, Document, Mongoose, Types } from 'mongoose';

// Define enums
export enum AmountValue {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    SIX = 6,
    TWELVE = 12,
    TWENTY_FIVE = 25,
    FIFTY = 50
}

export enum FrequentUsage {
    FOUR_TO_SIX = "4-6",
    ONE_TO_THREE = "1-3",
    LESS_THAN_ONCE_A_WEEK = "Less than once a week"
}

export enum DailyMeals {
    ONE = "1",
    TWO = "2",
    THREE = "3",
    MORE_THAN_THREE = "more than 3"
}

export enum TypeOfCooking {
    LIGHT = "Light",
    MODERATE = "Moderate",
    HEAVY = "Heavy"
}

export enum HouseHoldSize {
    ONE = "1",
    TWO_TO_THREE = "2-3",
    FOUR_TO_FIVE = "4-5",
    MORE_THAN_FIVE = "more than 5"
}

export enum TypeOfHouseHold {
    FAMILY = "Family",
    SHARED = "Shared",
    SINGLE = "Single"
}

export enum GenderComposition {
    ALL_FAMILY = "All Family",
    ALL_MALE = "All Male",
    MIXED = "Mixed"
}

export enum FrequentRefillPerMonth {
    ONE = "1",
    TWO_TO_THREE = "2-3",
    FOUR_TIMES_OR_MORE = "4 times or more"
}

// Define the interface
export interface IGasPrediction extends Document {
    amountValue: AmountValue;
    daysofUse: number;
    frequentUsage: FrequentUsage;
    dailyMeals: DailyMeals;
    typeOfCooking: TypeOfCooking;
    houseHoldSize: HouseHoldSize;
    typeOfHouseHold: TypeOfHouseHold;
    genderComposition: GenderComposition;
    usageAsideCooking: boolean;
    isOvenUsage: boolean;
    frequentRefillPerMonth: FrequentRefillPerMonth;
    lastRefill: Date;
    user: Types.ObjectId
}

// Define the schema
const gasPredictionSchema = new Schema<IGasPrediction>({
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
    lastRefill: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Define the model
const GasPrediction = mongoose.model<IGasPrediction>('GasPrediction', gasPredictionSchema);

export default GasPrediction;