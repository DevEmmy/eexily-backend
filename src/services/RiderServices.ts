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

        if(gasStation){
            data.gasStation = gasStation._id
        }
        
        let payload = await this.repository.create(data);
        return {payload, message: "Successful"}
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
        let schedules = await this.repository.find({rider: _id});
        return {payload: schedules}
    }

    async update(user: string, data: Partial<RiderInterface>){
        let gasStation = await this.gasStationRepo.getByRegCode(data.gasStationCode as string);

        if(gasStation){
            data.gasStation = gasStation._id
        }

        let payload = await this.repository.update({user}, data);
        console.log(payload)
        return {payload}
    }
}

export default RiderServices