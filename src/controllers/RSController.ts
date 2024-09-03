import { Service } from "typedi";
import RSServices from "../services/RefillScheduleServices";
import { Request, Response } from "express";
import { error, success } from "../utils/response";
import { IRefillSchedule } from "../models/refillSchedule";

@Service()
class RSController{
    constructor(private readonly service : RSServices){}

    async create(req: Request, res: Response){
        try{
            let data : IRefillSchedule = req.body;
            let {payload} = await this.service.create(data);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async getByUser(req: Request, res: Response){
        try{
            let {userId} = req.params
            let {payload} = await this.service.getByUser(userId);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
    
    async getByGCode(req: Request, res: Response){
        try{
            let {gcode} = req.params
            let {payload} = await this.service.getByGcode(gcode);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async updateRefillSchedule(req: Request, res: Response){
        try{
            let {status} = req.body;
            let {id} = req.params
            let {payload} = await this.service.updateScheduleStatus(id, status);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async getRefillScheduleByStatus(req: Request, res: Response){
        try{
            let {status} = req.params
            let {payload} = await this.service.getRefillScheduleByStatus(status);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
}

export default RSController