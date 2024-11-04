import { Service } from "typedi";
import { IMerchant } from "../models/merchant";
import MerchantRepository from "../repositories/MerchantRepository";

@Service()
class MerchantServices {
    constructor(private readonly repository: MerchantRepository) {}

    async getByUser(userId: string){
        try{
            const merchant = await this.repository.findOne({user: userId});
            return {
                message: "Successful",
                payload: merchant
            }
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Create a new merchant
    async createMerchant(data: Partial<IMerchant>) {
        try {
            const merchant = await this.repository.create(data);
            return {
                message: "Merchant created successfully",
                payload: merchant
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Get all merchants
    async getAllMerchants() {
        try {
            const merchants = await this.repository.find();
            return {
                message: "All merchants fetched successfully",
                payload: merchants
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Get a merchant by ID
    async getMerchantById(id: string) {
        try {
            const merchant = await this.repository.findOne({ _id: id });
            if (!merchant) {
                return { message: "Merchant not found" };
            }
            return {
                message: "Merchant fetched successfully",
                payload: merchant
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Get a merchant by store name
    async getMerchantByStoreName(storeName: string) {
        try {
            const merchant = await this.repository.findByStoreName(storeName);
            if (!merchant) {
                return { message: "Merchant not found" };
            }
            return {
                message: "Merchant fetched successfully",
                payload: merchant
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Get all open merchants
    async getOpenMerchants() {
        try {
            const openMerchants = await this.repository.findOpenMerchants();
            return {
                message: "Open merchants fetched successfully",
                payload: openMerchants
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Update a merchant's information
    async updateMerchant(id: string, data: Partial<IMerchant>) {
        try {
            const merchant = await this.repository.update({ _id: id }, data);
            if (!merchant) {
                return { message: "Merchant not found" };
            }
            return {
                message: "Merchant updated successfully",
                payload: merchant
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Update merchant's open status
    async updateOpenStatus(id: string, isOpened: boolean) {
        try {
            const merchant = await this.repository.updateOpenStatus(id, isOpened);
            if (!merchant) {
                return { message: "Merchant not found" };
            }
            return {
                message: "Merchant open status updated successfully",
                payload: merchant
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Update merchant's pricing details
    async updatePricing(id: string, retailPrice: number, regularPrice: number) {
        try {
            const merchant = await this.repository.updatePricing(id, retailPrice, regularPrice);
            if (!merchant) {
                return { message: "Merchant not found" };
            }
            return {
                message: "Merchant pricing updated successfully",
                payload: merchant
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    // Delete a merchant by ID
    async deleteMerchantById(id: string) {
        try {
            const merchant = await this.repository.delete({ _id: id });
            if (!merchant) {
                return { message: "Merchant not found" };
            }
            return {
                message: "Merchant deleted successfully",
                payload: merchant
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default MerchantServices;
