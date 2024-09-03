import { Service } from "typedi";
import RefillSchedule, { IRefillSchedule } from "../models/refillSchedule";
import { BaseRepository } from "./BaseRepository";
import { Types } from "mongoose";

@Service()
class RefillScheduleRepository extends BaseRepository<IRefillSchedule>{
    constructor(){
        super(RefillSchedule)
    }

    async getByGcode(gcode: string){
        return await this.model.findOne({gcode})
    }

    async getRefillScheduleByUser(user: string | Types.ObjectId){
        return await this.model.find({user})
    }

    async getRefillScheduleByStatus(status: string){
        return await this.model.find({status})
    }
}

export default RefillScheduleRepository