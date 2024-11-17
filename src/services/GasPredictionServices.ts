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
        const data = await this.gasPredictionRepository.create(gasPredictionData);
        return {
            payload: await this.predictGasCompletion(String(data.user._id)),
        };
    }

    // Get gas predictions for a specific user
    async getGasPredictionsByUser(userId: string) {
        return {
            payload: await this.predictGasCompletion(userId),
        };
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

    // Predict gas completion details
    async predictGasCompletion(userId: string): Promise<{ daysLeft: number; completionDate: Date; estimatedGasRemaining: number }> {
        const gasData = await this.gasPredictionRepository.findOne({ user: userId });
        if (!gasData) {
            throw new Error("Gas data not found for the user.");
        }

        const averageDailyUsage = this.calculateDailyUsage(gasData);
        const remainingGas = gasData.amountValue;
        const predictedDaysLeft = Math.floor(remainingGas / averageDailyUsage);

        // Calculate the completion date
        const lastRefillDate = new Date(gasData.lastRefill);
        const completionDate = new Date(lastRefillDate);
        completionDate.setDate(lastRefillDate.getDate() + predictedDaysLeft);

        // Calculate the estimated gas remaining
        const currentDate = new Date();
        const daysSinceLastRefill = Math.floor((currentDate.getTime() - lastRefillDate.getTime()) / (1000 * 60 * 60 * 24));
        const estimatedGasRemaining = remainingGas - averageDailyUsage * daysSinceLastRefill;

        return {
            daysLeft: Math.max(predictedDaysLeft, 0),
            completionDate,
            estimatedGasRemaining: Math.max(estimatedGasRemaining, 0),
        };
    }

    // Calculate average daily usage considering refill history and fallback logic
    private calculateDailyUsage(gasData: IGasPrediction): number {
        // Estimate based on refill history if available
        if (gasData.refillHistory.length > 1) {
            const historyBasedUsage = this.estimateUsageFromHistory(gasData.refillHistory);
            if (historyBasedUsage) return historyBasedUsage;
        }
        // Fallback to base estimation if history is insufficient
        return this.estimateUsageFallback(gasData);
    }

    // Estimate usage based on refill history
    private estimateUsageFromHistory(refillHistory: { refillDate: Date; amountFilled: number }[]): number | null {
        if (refillHistory.length < 2) return null;

        let totalDays = 0;
        let totalGasUsed = 0;

        for (let i = 1; i < refillHistory.length; i++) {
            const previousRefill = refillHistory[i - 1];
            const currentRefill = refillHistory[i];

            const daysDifference = Math.floor(
                (new Date(currentRefill.refillDate).getTime() - new Date(previousRefill.refillDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            totalDays += daysDifference;
            totalGasUsed += previousRefill.amountFilled;
        }

        return totalGasUsed / totalDays;
    }

    // Fallback usage estimation
    private estimateUsageFallback(gasData: IGasPrediction): number {
        let baseUsage = 0.3; // Default usage per day in kg

        // Adjust based on daily meals
        switch (gasData.dailyMeals) {
            case "1":
                baseUsage *= 0.7;
                break;
            case "2":
                baseUsage *= 1;
                break;
            case "3":
                baseUsage *= 1.3;
                break;
            case "more than 3":
                baseUsage *= 1.5;
                break;
        }

        // Adjust based on cooking type
        switch (gasData.typeOfCooking) {
            case "Light":
                baseUsage *= 0.8;
                break;
            case "Moderate":
                baseUsage *= 1;
                break;
            case "Heavy":
                baseUsage *= 1.5;
                break;
        }

        return baseUsage;
    }

    async findAll(){
        return await this.gasPredictionRepository.find()
    }
}

export default GasPredictionService;
