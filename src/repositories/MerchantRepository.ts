import { Service } from "typedi";
import { BaseRepository } from "./BaseRepository";
import Merchant, { IMerchant } from "../models/merchant";

@Service()
class MerchantRepository extends BaseRepository<IMerchant> {
    constructor() {
        super(Merchant);
    }

    // Find a merchant by store name
    async findByStoreName(storeName: string): Promise<IMerchant | null> {
        return this.findOne({ storeName });
    }

    // Retrieve all merchants that are currently open
    async findOpenMerchants(): Promise<IMerchant[]> {
        return this.find({ isOpened: true });
    }

    // Update a merchant's open status by ID
    async updateOpenStatus(id: string, isOpened: boolean): Promise<IMerchant | null> {
        return this.update({ _id: id }, { isOpened } as Partial<IMerchant>);
    }

    // Update merchant's pricing details by ID
    async updatePricing(id: string, retailPrice: number, regularPrice: number): Promise<IMerchant | null> {
        return this.update(
            { _id: id },
            { retailPrice, regularPrice } as Partial<IMerchant>
        );
    }
}

export default MerchantRepository;
