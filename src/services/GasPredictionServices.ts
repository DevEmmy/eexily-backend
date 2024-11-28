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
        gasPrediction.amountValue = refillData.amountFilled;

        return gasPrediction.save();
    }
// Predict gas completion details
async predictGasCompletion(userId: string): Promise<{ 
    daysLeft: number; 
    completionDate: Date; 
    estimatedGasRemaining: number; 
    isPause: boolean;
}> {
    const gasData = await this.gasPredictionRepository.findOne({ user: userId });
    if (!gasData) {
        throw new Error("Gas data not found for the user.");
    }

    const averageDailyUsage = this.calculateDailyUsage(gasData);
    const remainingGas = gasData.amountValue; // Gas remaining in kg

    // Handle paused state
    const currentDate = new Date();
    const lastRefillDate = new Date(gasData.lastRefill);
    let daysSinceLastRefill = Math.floor(
        (currentDate.getTime() - lastRefillDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (gasData.isPause && gasData.isPausedDate) {
        const pausedDate = new Date(gasData.isPausedDate);
        if (currentDate > pausedDate) {
            const pausedDays = Math.floor(
                (currentDate.getTime() - pausedDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            daysSinceLastRefill -= pausedDays;
        }
    }

    // Calculate the estimated gas remaining
    const estimatedGasRemaining = Math.max(
        remainingGas - averageDailyUsage * Math.min(daysSinceLastRefill, Math.floor(remainingGas / averageDailyUsage)),
        0
    );

    // Calculate realistic predicted days left and completion date
    const realisticPredictedDaysLeft = Math.floor(estimatedGasRemaining / averageDailyUsage);
    const completionDate = new Date(currentDate);
    completionDate.setDate(currentDate.getDate() + realisticPredictedDaysLeft);

    return {
        daysLeft: Math.max(realisticPredictedDaysLeft, 0),
        completionDate,
        estimatedGasRemaining,
        isPause: gasData.isPause
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

    // Avoid division by zero
    return totalDays > 0 ? totalGasUsed / totalDays : null;
}

// Fallback usage estimation with improved efficiency logic
private estimateUsageFallback(gasData: IGasPrediction): number {
    const baseUsage = 0.1; // Default usage per meal in kg based on analysis

    // Adjust based on daily meals
    const dailyMealsFactor = {
        "1": 1,       // 1 meal/day uses 0.1 kg/day
        "2": 2,       // 2 meals/day uses 0.2 kg/day
        "3": 3,       // 3 meals/day uses 0.3 kg/day
        "more than 3": 4 // Adjust higher for heavy usage
    }[gasData.dailyMeals] || 2; // Default to 2 meals/day

    // Adjust based on cooking type
    const cookingTypeFactor = {
        "Light": 0.8,
        "Moderate": 1,
        "Heavy": 1.5
    }[gasData.typeOfCooking] || 1; // Default to "Moderate"

    return baseUsage * dailyMealsFactor * cookingTypeFactor;
}

async togglePausePrediction(userId: string){
    let prediction = await this.gasPredictionRepository.findByUser(userId);
    if(!prediction){
         throw new Error("Prediction not found")
    }

    if(!prediction.isPause){
        prediction.isPause = true;
    }
    else{
        prediction.isPause = false;
    }

    return   {payload: await this.gasPredictionRepository.update({_id: prediction._id}, prediction), message: "Paused Successfully"}
}


    async findAll(){
        return await this.gasPredictionRepository.find()
    }

    async update(userId: string, data: Partial<IGasPrediction>){
        let prediction = await this.gasPredictionRepository.findByUser(userId);
        if(!prediction){
            throw new Error("Prediction Data Not Found");
        }

        let updatedData = await this.gasPredictionRepository.update({_id: prediction._id}, data);
        return {payload: updatedData, message: "Updated Prediction Data"}
    }
}

export default GasPredictionService;
