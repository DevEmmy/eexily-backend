import { Service } from "typedi";
import RefillScheduleRepository from "../repositories/RefillScheduleRepository";
import { Types } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";
import { IRefillSchedule } from "../models/refillSchedule";

@Service()
class RSServices {
    constructor(private readonly repo: RefillScheduleRepository) { }

    async create(data: Partial<IRefillSchedule>){
        try {
            let payload = await this.repo.create(data)

            return {
                payload
            }
        }
        catch (err: any) {
            return {
                message: "Schedule not found"
            }
        }
    }

    async getByGcode(gcode: string) {
        try {
            let payload = await this.repo.getByGcode(gcode);
            if (!payload) {
                return {
                    message: "Schedule not found"
                }
            }
            return {
                payload
            }
        }
        catch (err: any) {
            return {
                message: "Schedule not found"
            }
        }
    }

    async getByUser(user: string | Types.ObjectId) {
        let payload = await this.repo.getRefillScheduleByUser(user)
        return { payload }
    }

    async updateScheduleStatus(_id:any , status : RefillStatus){
        try{
            let payload = await this.repo.update(_id, {status})
            return {payload};
        }
        catch(err: any){
            throw new Error(err.message);
        }
    }


    async getRefillScheduleByStatus(status: string){
        try{
            let payload = await this.repo.getRefillScheduleByStatus(status)
            return {payload};
        }
        catch(err: any){
            throw new Error(err.message);
        }
    }

    
}

export default RSServices