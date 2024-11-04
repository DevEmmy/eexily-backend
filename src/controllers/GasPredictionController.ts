import { Request, Response, NextFunction } from "express";
import { Service, Inject } from "typedi";
import GasPredictionService from "../services/GasPredictionServices";


@Service()
class GasPredictionController {
    constructor(
        @Inject() private gasPredictionService: GasPredictionService
    ) {}

    // Update gas refill history and last refill date
    async updateGasRefill(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const refillData = {
                refillDate: req.body.refillDate,
                amountFilled: req.body.amountFilled
            };

            const updatedPrediction = await this.gasPredictionService.updateGasRefill(userId, refillData);
            res.status(200).json(updatedPrediction);
        } catch (error) {
            next(error);
        }
    }

     // Create gas prediction record
     async createGasPrediction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body)
            const gasPrediction = await this.gasPredictionService.createGasPrediction(req.body);
            res.status(201).json(gasPrediction);
        } catch (error) {
            next(error);
        }
    }

    // Get predictions for a specific user
    async getUserGasPredictions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const predictions = await this.gasPredictionService.getGasPredictionsByUser(userId);
            res.status(200).json(predictions);
        } catch (error) {
            next(error);
        }
    }

    // Predict gas usage (how many days left)
    // async predictGasUsage(req: Request, res: Response, next: NextFunction): Promise<any> {
    //     try {
    //         const gasPredictionId = req.params.id;
    //         const gasPrediction = await this.gasPredictionService.getGasPredictionsByUser(gasPredictionId);
            
    //         if (!gasPrediction) {
    //             return res.status(404).json({ message: "Gas prediction not found" });
    //         }

    //         const daysLeft = await this.gasPredictionService.predictGasUsage(gasPrediction);
    //         res.status(200).json({ daysLeft });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

export default GasPredictionController;
