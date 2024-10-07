import { Service } from "typedi";
import { IRider } from "../models/rider";
import { RiderInterface } from "../interfaces/rider";
import GasPredictionRepository from "../repositories/GasPrediction";
import { IGasPrediction } from "../models/gasPrediction";

@Service()
class GasPredictionServices{
    constructor(private readonly repository: GasPredictionRepository){}

    async create(data: IGasPrediction){
        let payload = await this.repository.create(data);
        return {payload}
    }

    // async 
    async analyzeGas(_id: string){
        try{
            let data = await this.repository.findOne({_id});

            let date;
            
        }
        catch(err: any){
            console.log(err)
        }
    }

}

export default GasPredictionServices