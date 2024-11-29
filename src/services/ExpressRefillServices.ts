import { Service } from "typedi";
import ExpressRefillRepository from "../repositories/ExpressRefillRepository";  // Update to the correct repository
import MerchantRepository from "../repositories/MerchantRepository";  // Updated to use MerchantRepository
import RiderRepository from "../repositories/RiderRepository";
import Individual, { IIndividual } from "../models/individual";  // Assuming the Individual model is in models folder
import mongoose, { Types } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";
import ExpressRefill, { IExpressRefill, SellerType } from "../models/expressRefill";  // Update to the correct model
import IndividualRepository from "../repositories/IndividualRepository";
import GasStationRepository from "../repositories/GasStationRepository";
import { TransactionService } from "./TransactionServices";
import { INotification } from "../models/notification";
import NotificationService from "./NotificationServices";
import { RiderType } from "../models/rider";

export interface Editor {
    merchant?: string;
    user?: string;
    rider?: string;
    gasStation?: string
}

@Service()
class ExpressRefillServices {
    constructor(
        private readonly repo: ExpressRefillRepository,
        private readonly merchantRepo: MerchantRepository,  // Using MerchantRepository
        private readonly riderRepo: RiderRepository,
        private readonly individualRepo: IndividualRepository,
        private readonly gasStationRepo: GasStationRepository,
        private readonly transactionService: TransactionService,
        private readonly notificationService: NotificationService
    ) { }

    async create(data: Partial<IExpressRefill>) {
        try {
            const individual: any = await Individual.findOne({ user: data.user }).populate("user");
            if (!individual) {
                throw new Error("Individual not found");
            }

            data.metaData = {
                userName: individual.firstName + " " + individual.lastName,
                userPhoneNumber: individual.user.phoneNumber,
                pickUpLocation: individual.location,
                pickUpAddress: individual.address
            }

            if (data.sellerType === SellerType.GAS_STATION) {
                let gasStation: any = await this.gasStationRepo.findOne({ address: individual.address });
                if (!gasStation) {
                    throw new Error("No matching gas station found")
                }
                data.gasStation = gasStation._id as Types.ObjectId
                data.metaData = {
                    ...data.metaData,
                    gasStationName: gasStation.gasStationName,
                    gasStationAddress: gasStation.address,
                    gasStationLocation: gasStation.location
                }
            }
            else {
                const merchant = await this.merchantRepo.findOne({});

                if (!merchant) {
                    throw new Error("No matching merchant found");
                }

                // Assign merchant to the express refill data
                data.merchant = merchant._id as Types.ObjectId; // Ensure this is correct if gasStation is a property of IExpressRefill
                data.metaData = {
                    ...data.metaData,
                    merchantName: merchant.firstName + " " + merchant.lastName,
                    merchantPhoneNumber: merchant.phoneNumber,
                    merchantAddress: merchant.address,
                    merchantLocation: merchant.location
                }
            }

            let payload: any = await this.repo.create(data);

            let schedule: any = await this.processSchedule(payload).catch(err => {
                console.error("Error in processSchedule:", err);
            });

            if (!schedule.assigned) {
                return { message: "Schedule not matched at the moment" }
            }

            payload = schedule.schedule

            return { payload };
        } catch (err: any) {
            return { message: "Schedule creation failed: " + err.message };
        }
    }

    async processSchedule(data: Partial<IExpressRefill>) {
        try {
            console.log("Assigning Schedule");

            let schedule = await this.repo.findOne({ _id: data._id });
            if (!schedule) {
                return { message: "Schedule not found" };
            }

            // Find the individual to retrieve the address for matching
            const individual = await this.individualRepo.findOne({ user: schedule.user })
            console.log(individual)
            if (!individual) {
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
                            riderType: RiderType.RIDER,
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
                    schedule.metaData = {
                        ...schedule.metaData,
                        riderName: rider.firstName + " " + rider.lastName,
                        riderPhoneNumber: rider.phoneNumber
                    }
                    schedule.status = RefillStatus.MATCHED;
                    console.log("Matched to Rider:", rider._id);

                    schedule.transactionData = await this.transactionService.initializePayment(data.price as number, data.user as string, data.merchant as string, data._id as string);

                    schedule = await this.repo.update({ _id: schedule._id }, schedule);
                    assigned = true;
                    break;
                }
            }

            if (!assigned) {
                console.log("No available rider found");
            }

            return { schedule, assigned }
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
            payload: await this.repo.find({ merchant: merchantId })  // gasStation refers to merchant
        };
    }

    async getOrdersByUser(userId: string) {
        return {
            payload: await this.repo.find({ user: userId })  // gasStation refers to merchant
        };
    }

    async getOrdersByGasStation(gasStationId: string) {  // Renamed to reflect merchant context
        return {
            payload: await this.repo.find({ gasStation: gasStationId })  // gasStation refers to merchant
        };
    }

    async updateStatus(editor: Editor, gcode: string, status: RefillStatus) {
        try {
            const { merchant, user, rider, gasStation } = editor;
            let schedule = await this.repo.findOne({ gcode });

            if (!schedule) {
                return { message: "Schedule Not Found" };
            }

            // if (
            //     (merchant && String(schedule.merchant) !== String(merchant)) ||
            //     (user && String(schedule.user) !== String(user)) ||
            //     (gasStation && String(schedule.gasStation) !== String(gasStation)) ||
            //     (rider && String(schedule.rider) !== String(rider))
            // ) {
            //     return { message: "You cannot edit this status" };
            // }

            schedule.status = status;

            let notification: Partial<INotification> = {
                userId: new mongoose.Types.ObjectId(schedule.user),
                actionLabel: "Order Status",
            };

            switch (status) {
                case RefillStatus.PICK_UP:
                    notification.message = "Your gas cylinder has been picked up!";
                    notification.notificationType = "PICK_UP";

                    let userNotification: Partial<INotification> = {
                        message: "Your gas cylinder has been picked up!",
                        actionLabel: "Order Status",
                        notificationType: "PICK_UP",
                        userId: new mongoose.Types.ObjectId(schedule.user)
                    }

                    this.notificationService.sendNotification(userNotification)
                    break;

                case RefillStatus.REFILL:
                    const merchantDetails = await this.merchantRepo.findOne({ _id: schedule.merchant });
                    const riderDetails = await this.riderRepo.findOne({ _id: schedule.rider });

                    if (!merchantDetails || !riderDetails) {
                        return { message: "Merchant or Rider details not found" };
                    }

                    const gasPrice = merchantDetails.retailPrice; // Price of 1kg
                    const deliveryFee = 1000; // Fixed delivery fee
                    const profit = gasPrice - 1000; // Profit margin for the merchant
                    const platformShare = 0.2 * profit + 0.3 * deliveryFee;
                    const merchantPayment = gasPrice - platformShare; // Merchant's share
                    const riderPayment = deliveryFee - 0.3 * deliveryFee; // Rider's share

                    // Create transfer recipients and initiate transfers
                    // const merchantRecipientCode = await this.createTransferRecipient(
                    //     merchantDetails.accountNumber,
                    //     merchantDetails.bankCode,
                    //     "Merchant"
                    // );
                    // await this.initiateTransfer(merchantRecipientCode, merchantPayment, "Merchant Payment");

                    // const riderRecipientCode = await this.createTransferRecipient(
                    //     riderDetails.accountNumber,
                    //     riderDetails.bankCode,
                    //     "Rider"
                    // );
                    // await this.initiateTransfer(riderRecipientCode, riderPayment, "Rider Payment");

                    // Notify merchant and rider
                    // this.notificationService.sendNotification({
                    //     userId: merchantDetails._id as Types.ObjectId,
                    //     message: `You have been credited ₦${merchantPayment.toFixed(2)} for the refill.`,
                    //     actionLabel: "Payment Received",
                    //     notificationType: "PAYMENT",
                    // });

                    // this.notificationService.sendNotification({
                    //     userId: riderDetails._id as Types.ObjectId,
                    //     message: `You have been credited ₦${riderPayment.toFixed(2)} for the delivery.`,
                    //     actionLabel: "Payment Received",
                    //     notificationType: "PAYMENT",
                    // });

                    let riderNotification: Partial<INotification> = {
                        message: "The gas cylinder has been refilled!",
                        actionLabel: "Order Status",
                        notificationType: "REFILL",
                        userId: new mongoose.Types.ObjectId(schedule.user)
                    }

                    this.notificationService.sendNotification(riderNotification)

                    notification.message = "Your gas cylinder has been refilled!";
                    notification.notificationType = "REFILL";
                    break;

                case RefillStatus.DELIVERED:
                    notification.message = "Your gas cylinder has been delivered!";
                    notification.notificationType = "DELIVERED";

                    let anotherUserNotification: Partial<INotification> = {
                        message: "Your gas cylinder has been delivered",
                        actionLabel: "Order Status",
                        notificationType: "DELIVERED",
                        userId: new mongoose.Types.ObjectId(schedule.user)
                    }

                    this.notificationService.sendNotification(anotherUserNotification)
                    break;

                default:
                    break;
            }

            // Send user notification
            this.notificationService.sendNotification(notification);

            // Update the schedule
            schedule = await this.repo.update({ gcode }, schedule);

            return { payload: schedule, message: "Status Updated" };
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    async createTransferRecipient(accountNumber: string, bankCode: string, type: string): Promise<string> {
        try {
            const recipientResponse = await this.transactionService.createTransferRecipient(
                type,
                accountNumber,
                bankCode,
            );

            if (recipientResponse.status !== "success") {
                throw new Error(`Failed to create transfer recipient for ${type}`);
            }

            return recipientResponse.data.recipientCode; // Unique recipient code
        } catch (err: any) {
            throw new Error(`Error creating transfer recipient: ${err.message}`);
        }
    }

    async initiateTransfer(recipientCode: string, amount: number, description: string): Promise<void> {
        try {
            const transferResponse = await this.transactionService.initiateTransfer(
                amount,
                recipientCode,
                description,
            );

            if (transferResponse.status !== "success") {
                throw new Error(`Failed to initiate transfer: ${transferResponse.message}`);
            }
        } catch (err: any) {
            throw new Error(`Error initiating transfer: ${err.message}`);
        }
    }

}

export default ExpressRefillServices;
