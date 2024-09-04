import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import GasStation, { IGasStation } from "../models/gasStation";

@Service()
class GasStationRepository extends BaseRepository<IGasStation>{
    constructor(){
            super(GasStation)
    }

    async getByRegCode(regCode: string){
        return await this.model.findOne({regCode})
    }
}

export default GasStationRepository