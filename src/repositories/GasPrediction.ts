import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import GasPrediction, { IGasPrediction } from "../models/gasPrediction";

@Service()
class GasPredictionRepository extends BaseRepository<IGasPrediction>{
    constructor(){
            super(GasPrediction)
    }

}

export default GasPredictionRepository