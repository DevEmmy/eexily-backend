import { Request, Response } from "express";
import { Service } from "typedi";
import ExpressRefillServices from "../services/ExpressRefillServices";  // Adjust the path as necessary
import { RefillStatus } from "../enum/refillStatus";

@Service()
class ExpressRefillController {
    constructor(private readonly expressRefillServices: ExpressRefillServices) {}

    async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const result = await this.expressRefillServices.create(data);
            return res.status(201).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getOrdersByRider(req: Request, res: Response) {
        try {
            const { rider } = req.params;
            const result = await this.expressRefillServices.getOrdersByRider(rider);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getOrdersByMerchant(req: Request, res: Response) {
        try {
            const { merchantId } = req.params;
            const result = await this.expressRefillServices.getOrdersByMerchant(merchantId);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getOrdersByGasStation(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.expressRefillServices.getOrdersByGasStation(id);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async getOrdersByUser(req: Request, res: Response) {
        try {
            const userId = req.body.user
            const result = await this.expressRefillServices.getOrdersByUser(userId);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { gcode } = req.params;
            const { editor, status } = req.body; // Expecting editor and status in the request body
            const result = await this.expressRefillServices.updateStatus(editor, gcode, status);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default ExpressRefillController;
