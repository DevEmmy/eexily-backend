import { Service } from "typedi";
import "reflect-metadata";
import { Request, Response } from "express";
import { RiderInterface } from "../interfaces/rider";
import { error, success } from "../utils/response";
import RiderServices from "../services/RiderServices";

@Service()
export class RiderController {
    constructor(
        private readonly service: RiderServices,
    ) {}

    async createRider(req: Request, res: Response) {
        try {
            const body: RiderInterface = req.body;
            let { payload, message } = await this.service.create(body);
            
            if (!payload && message) {
                return error(message, res, 400);
            }
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async getAllRiders(req: Request, res: Response) {
        try {
            let { payload } = await this.service.getAll();
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async getRidersByGasStation(req: Request, res: Response) {
        try {
            const { gasStation } = req.params;
            let { payload } = await this.service.getRiderByGasStation(gasStation);
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400)
        }
    }

    async getRiderSchedule(req: Request, res: Response) {
        try {
            const { riderId } = req.params;
            let { payload } = await this.service.getRiderSchedule(riderId);
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async updateRider(req: Request, res: Response) {
        try {
            const { riderId } = req.params;
            let user = req.body.user;
            const body = req.body;
            let { payload } = await this.service.update(user, body);
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }
}

export default RiderController;
