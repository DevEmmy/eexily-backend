import { Request, Response, NextFunction } from "express";
import { Service, Inject } from "typedi";
import GasPredictionService from "../services/GasPredictionServices";
import { error, success } from "../utils/response";


@Service()
class GasPredictionController {
    constructor(
        @Inject() private gasPredictionService: GasPredictionService
    ) {}

    // Update gas refill history and last refill date
    async updateGasRefill(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.body.user
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
            const userId = req.body.user
            const predictions = await this.gasPredictionService.getGasPredictionsByUser(userId);
            res.status(200).json(predictions);
        } catch (error) {
            next(error);
        }
    }

    async togglePausePrediction(req: Request, res: Response){
        try{
            const userId = req.body.user;
            let {payload, message} = await this.gasPredictionService.togglePausePrediction(userId);

            return success(payload, res, message);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async update(req: Request, res: Response){
        try{
            const userId = req.body.user;
            const data = req.body;
            let {payload, message} = await this.gasPredictionService.update(userId, data);

            return success(payload, res, message);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
}

export default GasPredictionController;
