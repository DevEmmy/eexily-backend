import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import GasPrediction, { IGasPrediction } from "../models/gasPrediction";

@Service()
class GasPredictionRepository extends BaseRepository<IGasPrediction> {
    constructor() {
        super(GasPrediction);
    }

    // Custom repository methods (if needed) can be added here
    async findByUser(userId: string): Promise<IGasPrediction | null> {
        return this.model.findOne({ user: userId });
    }
}

export default GasPredictionRepository;
