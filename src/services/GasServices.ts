import { GasDto, GasUsageInterface, UpdateGasDto } from "../interfaces/gas";
import { IGas } from "../models/gas";
import "reflect-metadata";
import { Service } from "typedi";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import GasRepository from "../repositories/GasRepository";

type UsageType = 'daily' | 'weekly' | 'monthly';

export interface UsageParams {
    userId: string;
    type: UsageType;
    year: number;
    month?: number;
    day?: number;
}

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

    async updateGas(id: string, data: Partial<IGas>) {
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

    async getGasByUser(userId: string){
        try{
            const payload = await this.repo.findByOwner(userId);

            return{
                payload
            }
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    async updateGasLevel(id: string, data: GasUsageInterface){
        try{
            let gas = await this.repo.findById(id);
            if(!gas){
                return {
                    message: "Gas not Found"
                }
            }

            gas.usage.push(data);
            gas.level = gas.level - data.amountUsed;

            let payload = await this.repo.update(id, gas)

            return{
                payload
            }
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    async getUsageData(params: UsageParams) {
        const { userId, type, year, month, day } = params;
        let result;

        switch (type) {
            case 'daily':
                if (month && day) {
                    result = await this.repo.trackUsageByDay(userId, day, month, year);
                } else {
                    throw new Error('Month and Day are required for daily usage.');
                }
                break;

            case 'weekly':
                if (month) {
                    result = await this.repo.getWeeklyUsage(userId, month, year);
                } else {
                    throw new Error('Month is required for weekly usage.');
                }
                break;

            case 'monthly':
                result = await this.repo.getMonthlyUsage(userId, year);
                break;

            default:
                throw new Error('Invalid usage type. Please use "daily", "weekly", or "monthly".');
        }

        if(result.length > 0){
            let pdfBuffer = await this.generateUsagePdf(result, params)

            return{
                payload: result,
                pdfBuffer,
                message: "Successful"
            }
        }
        return {payload: result, message: "No Usage"};
    }

    async generateUsagePdf(data: any, params: UsageParams): Promise<Buffer> {
        
        const doc = new PDFDocument();
        const pdfBuffer: Buffer = await new Promise(resolve => {
            const bufferChunks: Buffer[] = [];

            doc.on('data', chunk => bufferChunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(bufferChunks)));

            doc.fontSize(16).text(`Gas Usage Report (${params.type} - ${params.year})`, { align: 'center' });
            doc.moveDown();

            data.forEach((item: any) => {
                doc.fontSize(12).text(`- ${JSON.stringify(item)}`);
                doc.moveDown();
            });

            doc.end();
        });

        return pdfBuffer;
    }

}

export default GasServices;
