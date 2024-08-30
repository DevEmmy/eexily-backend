import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import GasStation, { IGasStation } from "../models/gasStation";

@Service()
class GasStationRepository extends BaseRepository<IGasStation>{
    constructor(){
            super(GasStation)
    }
}

export default GasStationRepository