import { Service, Inject } from "typedi";
import { IGasPrediction } from "../models/gasPrediction";
import GasPredictionRepository from "../repositories/GasPrediction";

@Service()
class GasPredictionService {
    constructor(
        @Inject() private gasPredictionRepository: GasPredictionRepository
    ) {}

    // Create a new gas prediction record
    async createGasPrediction(gasPredictionData: Partial<IGasPrediction>) {
        let data = await this.gasPredictionRepository.create(gasPredictionData)
        return {payload: {
            data, predictedDate: await this.predictGasUsage(data)
        }}
    }

    // Get gas prediction for a specific user
    async getGasPredictionsByUser(userId: string){
        let data = await this.gasPredictionRepository.findByUser(userId);
        return {payload: {
            data, predictedDate: await this.predictGasUsage(data as IGasPrediction)
        }}
    }

    // Update the refill history and last refill
    async updateGasRefill(userId: string, refillData: { refillDate: Date; amountFilled: number }): Promise<IGasPrediction | null> {
        const gasPrediction = await this.gasPredictionRepository.findByUser(userId);
        
        if (!gasPrediction) {
            throw new Error("Gas prediction not found");
        }

        const newRefill = {
            refillDate: refillData.refillDate,
            amountFilled: refillData.amountFilled,
        };

        gasPrediction.refillHistory.push(newRefill);
        gasPrediction.lastRefill = refillData.refillDate;
        gasPrediction.amountValue += refillData.amountFilled;

        return gasPrediction.save();
    }

    // Main method for gas usage prediction
    async predictGasUsage(gasPrediction: IGasPrediction): Promise<number> {
        // Check if there's enough refill history
        const hasSufficientHistory = gasPrediction.refillHistory.length >= 2;

        if (hasSufficientHistory) {
            // Use history-based prediction
            return this.predictUsingHistory(gasPrediction);
        } else {
            // Fall back to initial algorithm if insufficient history
            return this.predictUsingInitialAlgorithm(gasPrediction);
        }
    }

    // Prediction using refill history
    private predictUsingHistory(gasPrediction: IGasPrediction): number {
        const averageDailyConsumption = this.calculateAverageDailyConsumption(gasPrediction);
        
        if (!averageDailyConsumption) {
            throw new Error("Insufficient refill history to make a prediction.");
        }

        const daysSinceLastRefill = this.getDaysSinceLastRefill(gasPrediction.lastRefill);
        const gasRemaining = gasPrediction.amountValue - (averageDailyConsumption * daysSinceLastRefill);

        if (gasRemaining <= 0) return 0;

        return Math.floor(gasRemaining / averageDailyConsumption);
    }

    // Fallback prediction using the initial algorithm
    private predictUsingInitialAlgorithm(gasPrediction: IGasPrediction): number {
        // Initial algorithm estimate (simplified based on amount of gas, meals, and type of cooking)
        const mealsPerDay = this.getMealsPerDay(gasPrediction.dailyMeals);
        const consumptionRate = this.getConsumptionRate(gasPrediction.typeOfCooking);

        const totalConsumptionPerDay = mealsPerDay * consumptionRate;

        const daysSinceLastRefill = this.getDaysSinceLastRefill(gasPrediction.lastRefill);
        const gasRemaining = gasPrediction.amountValue - (totalConsumptionPerDay * daysSinceLastRefill);

        if (gasRemaining <= 0) return 0;

        // Estimate how many days the remaining gas will last
        return Math.floor(gasRemaining / totalConsumptionPerDay);
    }

    // Helper methods for initial algorithm logic
    private getMealsPerDay(dailyMeals: string): number {
        switch (dailyMeals) {
            case "1": return 1;
            case "2": return 2;
            case "3": return 3;
            case "more than 3": return 4;  // Assume 4 meals for "more than 3"
            default: return 2;  // Default to 2 meals per day if not specified
        }
    }

    private getConsumptionRate(typeOfCooking: string): number {
        switch (typeOfCooking) {
            case "Light": return 0.5;
            case "Moderate": return 1;
            case "Heavy": return 1.5;
            default: return 1;  // Default to moderate consumption rate
        }
    }

    // Calculate average daily gas consumption using refill history
    private calculateAverageDailyConsumption(gasPrediction: IGasPrediction): number | null {
        const { refillHistory } = gasPrediction;

        if (refillHistory.length < 2) {
            return null;
        }

        let totalGasUsed = 0;
        let totalDays = 0;

        for (let i = 1; i < refillHistory.length; i++) {
            const previousRefill = refillHistory[i - 1];
            const currentRefill = refillHistory[i];

            const daysBetweenRefills = this.getDaysBetweenDates(previousRefill.refillDate, currentRefill.refillDate);
            const gasUsed = currentRefill.amountFilled;

            totalGasUsed += gasUsed;
            totalDays += daysBetweenRefills;
        }

        return totalGasUsed / totalDays;
    }

    private getDaysSinceLastRefill(lastRefillDate: Date): number {
        const today = new Date();
        return Math.floor((today.getTime() - lastRefillDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    private getDaysBetweenDates(startDate: Date, endDate: Date): number {
        return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
}

export default GasPredictionService;
