import { Service } from "typedi";
import RiderRepository from "../repositories/RiderRepository";
import { IRider } from "../models/rider";
import { RiderInterface } from "../interfaces/rider";
import GasStationRepository from "../repositories/GasStationRepository";

@Service()
class RiderServices{
    constructor(private readonly repository : RiderRepository, private readonly gasStationRepo : GasStationRepository){}

    async create(data: RiderInterface){
        let gasStation = await this.gasStationRepo.getByRegCode(data.gasStationCode);

        if(!gasStation){
            return {
                message: "Gas Station Not Found"
            }
        }
        data.gasStation = gasStation._id
        let payload = await this.repository.create(data);
        return {payload}
    }

    async getAll(){
        let payload = await this.repository.find()
        return {payload}
    }
}

export default RiderServices