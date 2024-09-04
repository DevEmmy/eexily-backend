import { Service } from "typedi";
import { Request, Response } from "express";
import { error, success } from "../utils/response";
import GasStationServices from "../services/GasStationServices";
import { IGasStation } from "../models/gasStation";


@Service()
class GasStationController{
    constructor(private readonly service : GasStationServices){}

    async create(req: Request, res: Response){
        try{
            let data : IGasStation = req.body;
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
            let {payload} = await this.service.getGasStationByUser(userId);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
    
    async getByRegcode(req: Request, res: Response){
        try{
            let {regCode} = req.params
            let {payload} = await this.service.getByRegCode(regCode);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async update(req: Request, res: Response){
        try{
            let data : Partial<IGasStation> = req.body;
            let {id} = req.params
            let {payload} = await this.service.update(id, data);
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }

    async getAll(req: Request, res: Response){
        try{
            let {payload} = await this.service.getAll();
            return success(payload, res);
        }
        catch(err: any){
            error(err.message, res, err.status||400);
        }
    }
}

export default GasStationController