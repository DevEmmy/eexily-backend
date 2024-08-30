import { Service } from "typedi";
import GasStationRepository from "../repositories/GasStationRepository";
import { IGasStation } from "../models/gasStation";

@Service()
class GasStationServices{
    constructor(private readonly repository : GasStationRepository){}

    async create(data: IGasStation){
        return this.repository.create(data);
    }

    async getAll(){
        return this.repository.find()
    }
}

export default GasStationServices