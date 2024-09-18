import { Service } from "typedi";
import RiderRepository from "../repositories/RiderRepository";
import { IRider } from "../models/rider";
import { RiderInterface } from "../interfaces/rider";
import GasStationRepository from "../repositories/GasStationRepository";
import RefillScheduleRepository from "../repositories/RefillScheduleRepository";

@Service()
class RiderServices{
    constructor(private readonly repository : RiderRepository, private readonly gasStationRepo : GasStationRepository, private readonly  refillScheduleRepo : RefillScheduleRepository){}

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

    async getRiderByGasStation(gasStation: string){
        let payload = await this.repository.find({gasStation});
        return {payload};
    }

    async getRiderSchedule(_id: string){
        let schedules = await this.refillScheduleRepo.find({rider: _id});
        return {payload: schedules}
    }

    async update(_id: string, data: Partial<IRider>){
        let payload = await this.refillScheduleRepo.update({_id}, data);
        return {payload}
    }
}

export default RiderServices