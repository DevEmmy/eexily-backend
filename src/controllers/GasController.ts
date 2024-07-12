import { Service } from "typedi";
import "reflect-metadata";
import { GasServices } from "../services/GasServices";
import { Request, Response } from "express";
import { GasDto, UpdateGasDto } from "../dto/gas-dto";
import { error, success } from "../utils/response";

@Service()
export class GasController {
    constructor(
        private readonly service: GasServices,
    ) { }

    async createGas(req: Request, res: Response) {
        try {
            const body: GasDto = req.body;
            const { payload, message } = await this.service.createGas(body);
            if (!payload && message) {
                return error(message, res, 400);
            }
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async getGasById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { payload, message } = await this.service.getGasById(id);
            if (!payload && message) {
                return error(message, res, 400);
            }
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async getAllGas(req: Request, res: Response) {
        try {
            const { payload, message } = await this.service.getAllGas();
            if (!payload && message) {
                return error(message, res, 400);
            }
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async updateGas(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body: UpdateGasDto = req.body;
            const { payload, message } = await this.service.updateGas(id, body);
            if (!payload && message) {
                return error(message, res, 400);
            }
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async deleteGasById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { payload, message } = await this.service.deleteGasById(id);
            if (!payload && message) {
                return error(message, res, 400);
            }
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async findGasByAppliance(req: Request, res: Response) {
        try {
            const { appliance } = req.params;
            const { payload, message } = await this.service.findGasByAppliance(appliance);
            if (!payload && message) {
                return error(message, res, 400);
            }
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }
}

export default GasController;
