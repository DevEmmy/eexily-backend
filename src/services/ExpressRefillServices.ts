import { Service } from "typedi";
import ExpressRefillRepository from "../repositories/ExpressRefillRepository";  // Update to the correct repository
import MerchantRepository from "../repositories/MerchantRepository";  // Updated to use MerchantRepository
import RiderRepository from "../repositories/RiderRepository";
import Individual, { IIndividual } from "../models/individual";  // Assuming the Individual model is in models folder
import { Types } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";
import ExpressRefill, { IExpressRefill } from "../models/expressRefill";  // Update to the correct model

export interface Editor {
    merchant?: string;  
    user?: string;
    rider?: string;
}

@Service()
class ExpressRefillServices {
    constructor(
        private readonly repo: ExpressRefillRepository,
        private readonly merchantRepo: MerchantRepository,  // Using MerchantRepository
        private readonly riderRepo: RiderRepository
    ) { }

    async create(data: Partial<IExpressRefill>) {
        try {
            const individual = await Individual.findOne({ user: data.user });
            if (!individual) {
                throw new Error("Individual not found");
            }

            // Find a merchant with a matching address
            const merchant = await this.merchantRepo.findOne({ address: individual.address });
            if (!merchant) {
                throw new Error("No matching merchant found");
            }

            // Assign merchant to the express refill data
            data.merchant = merchant._id as Types.ObjectId; // Ensure this is correct if gasStation is a property of IExpressRefill
            const payload = await this.repo.create(data);

            // Trigger the schedule processing
            this.processSchedule(payload).catch(err => {
                console.error("Error in processSchedule:", err);
            });

            return { payload };
        } catch (err: any) {
            return { message: "Schedule creation failed: " + err.message };
        }
    }

    async processSchedule(data: Partial<IExpressRefill>) {
        try {
            console.log("Assigning Schedule");

            const schedule = await this.repo.findOne({ _id: data._id });
            if (!schedule) {
                return { message: "Schedule not found" };
            }

            // Find the individual to retrieve the address for matching
            const individual = await Individual.findById(schedule.user);
            if (!individual || !individual.address) {
                throw new Error("Individual address not available for matching");
            }

            // Find riders for the matched merchant
            const riders = await this.riderRepo.find();
            let assigned = false;

            for (const rider of riders) {
                // Check rider's schedule to ensure they have fewer than 20 orders for the day
                const ordersForToday = await ExpressRefill.aggregate([
                    {
                        $match: {
                            rider: rider._id,
                            createdAt: {
                                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                                $lt: new Date(new Date().setHours(23, 59, 59, 999))
                            }
                        }
                    }
                ]);

                if (ordersForToday.length < 20) {
                    schedule.rider = rider._id as string;
                    schedule.status = RefillStatus.MATCHED;
                    console.log("Matched to Rider:", rider._id);

                    await this.repo.update({ _id: schedule._id }, schedule);
                    assigned = true;
                    break;
                }
            }

            if (!assigned) {
                console.log("No available rider found");
            }
        } catch (err: any) {
            throw new Error("Error processing schedule: " + err.message);
        }
    }

    async getOrdersByRider(rider: string) {
        return {
            payload: await this.repo.find({ rider })
        };
    }

    async getOrdersByMerchant(merchantId: string) {  // Renamed to reflect merchant context
        return {
            payload: await this.repo.find({ gasStation: merchantId })  // gasStation refers to merchant
        };
    }

    async updateStatusByMerchant(editor: Editor, gcode: string, status: RefillStatus) {  // Renamed to updateStatusByMerchant
        try {
            const { merchant, user, rider } = editor;
            let schedule = await this.repo.findOne({ gcode });

            if (!schedule) {
                return { message: "Schedule Not Found" };
            }

            if ((merchant && String(schedule.merchant) !== String(merchant)) ||
                (user && String(schedule.user) !== String(user)) ||
                (rider && String(schedule.rider) !== String(rider))) {
                return { message: "You cannot edit this status" };
            }

            schedule.status = status;
            schedule = await this.repo.update({ gcode }, schedule);
            return { payload: schedule, message: "Status Updated" };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}

export default ExpressRefillServices;
