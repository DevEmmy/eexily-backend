import { Service } from "typedi";
import "reflect-metadata";
import { Request, Response } from "express";
import { IIndividual } from "../models/individual";
import { error, success } from "../utils/response";
import IndividualServices from "../services/IndividualServices";

@Service()
export class IndividualController {
    constructor(
        private readonly service: IndividualServices,
    ) {}

    async create(req: Request, res: Response) {
        try {
            const body: IIndividual = req.body;
            let { payload } = await this.service.create(body);
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            let { payload } = await this.service.getAll();
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            let { payload } = await this.service.getById(id);
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async getByUser(req: Request, res: Response) {
        try {
            const { user } = req.params;
            let { payload } = await this.service.getByUser(user);
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }

    async update(req: Request, res: Response) {
        try {
            let user = req.body.user
            const body: Partial<IIndividual> = req.body;
            let { payload } = await this.service.update(user, body);
            return success(payload, res);
        } catch (err: any) {
            error(err.message, res, err.status || 400);
        }
    }
}

export default IndividualController;
