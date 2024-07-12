import { GasDto, UpdateGasDto } from "../dto/gas-dto";
import GasRepository from "../repositories/GasRepository";
import "reflect-metadata";
import { Service } from "typedi";

@Service()
export class GasServices {
    constructor(private readonly repo: GasRepository) { }

    async createGas(data: GasDto) {
        try {
            const gas = await this.repo.create(data);
            return {
                message: "Gas record created successfully",
                payload: gas
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async getGasById(id: string) {
        try {
            const gas = await this.repo.findById(id);
            if (!gas) {
                return { message: "Gas record not found" };
            }
            return {
                message: "Gas record fetched successfully",
                payload: gas
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async getAllGas() {
        try {
            const gases = await this.repo.findAll();
            return {
                message: "All gas records fetched successfully",
                payload: gases
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async updateGas(id: string, data: UpdateGasDto) {
        try {
            const gas = await this.repo.update(id, data);
            if (!gas) {
                return { message: "Gas record not found" };
            }
            return {
                message: "Gas record updated successfully",
                payload: gas
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async deleteGasById(id: string) {
        try {
            const gas = await this.repo.deleteById(id);
            if (!gas) {
                return { message: "Gas record not found" };
            }
            return {
                message: "Gas record deleted successfully",
                payload: gas
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async findGasByAppliance(appliance: string) {
        try {
            const gas = await this.repo.findByAppliance(appliance);
            if (!gas) {
                return { message: "Gas record not found" };
            }
            return {
                message: "Gas record fetched successfully",
                payload: gas
            };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default GasServices;
