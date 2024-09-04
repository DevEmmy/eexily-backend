import { Service } from "typedi";
import GasStationRepository from "../repositories/GasStationRepository";
import { IGasStation } from "../models/gasStation";
import { Types } from "mongoose";

@Service()
class GasStationServices{
    constructor(private readonly repository : GasStationRepository){}

    async create(data: IGasStation){
        return {payload: await this.repository.create(data)};
    }

    async getAll(){
        let payload = await this.repository.find()
        return {payload}
    }

    async update(_id: string, data: Partial<IGasStation>){
        let payload = await this.repository.update({_id}, data)
        return {
            payload
        }
    }

    async getById(_id: string){
        let payload = await this.repository.findOne({_id})
        return {
            payload
        }
    }

    async getByRegCode(regCode: string){
        try{
            let payload = await this.repository.getByRegCode(regCode);
        return {
            payload
        }
        }
        catch(err: any){
            throw new Error("Gas Station not Found")
       }
    }

    async getGasStationByUser(user : Types.ObjectId | string){
        try{
                let payload = await this.repository.findOne({user})
       
        return {
            payload
        }
        }
    catch(err: any){
         throw new Error("Gas Station not Found")
    }
    }
}

export default GasStationServices