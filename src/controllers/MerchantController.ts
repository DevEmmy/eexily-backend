import { Request, Response } from "express";
import { Service } from "typedi";
import MerchantServices from "../services/MerchantServices";
import { IMerchant } from "../models/merchant";

@Service()
class MerchantController {
    constructor(private readonly merchantService: MerchantServices) {}

    // Create a new merchant
    async createMerchant(req: Request, res: Response) {
        try {
            const data: Partial<IMerchant> = req.body;
            const result = await this.merchantService.createMerchant(data);
            return res.status(201).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Get all merchants
    async getAllMerchants(req: Request, res: Response) {
        try {
            const result = await this.merchantService.getAllMerchants();
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Get a merchant by ID
    async getMerchantById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.merchantService.getMerchantById(id);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Get a merchant by store name
    async getMerchantByStoreName(req: Request, res: Response) {
        try {
            const { storeName } = req.params;
            const result = await this.merchantService.getMerchantByStoreName(storeName);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Get all open merchants
    async getOpenMerchants(req: Request, res: Response) {
        try {
            const result = await this.merchantService.getOpenMerchants();
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Update a merchant's information
    async updateMerchant(req: Request, res: Response) {
        try {
            let user = req.body.user
            const data: Partial<IMerchant> = req.body;
            let merchant: any = await this.merchantService.getByUser(user)
            const result = await this.merchantService.updateMerchant(merchant.payload._id, data);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Update merchant's open status
    async updateOpenStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { isOpened } = req.body;
            const result = await this.merchantService.updateOpenStatus(id, isOpened);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Update merchant's pricing details
    async updatePricing(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { retailPrice, regularPrice } = req.body;
            const result = await this.merchantService.updatePricing(id, retailPrice, regularPrice);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Delete a merchant by ID
    async deleteMerchantById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.merchantService.deleteMerchantById(id);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default MerchantController;
