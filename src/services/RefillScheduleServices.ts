import { Service } from "typedi";
import RefillScheduleRepository from "../repositories/RefillScheduleRepository";
import { Types } from "mongoose";
import { RefillStatus } from "../enum/refillStatus";
import RefillSchedule, { IRefillSchedule } from "../models/refillSchedule";
import GasStationRepository from "../repositories/GasStationRepository";
import RiderRepository from "../repositories/RiderRepository";

export interface Editor {
    gasStation?: string,
    user?: string,
    rider?: string
}

@Service()
class RSServices {
    constructor(private readonly repo: RefillScheduleRepository, private readonly gasStationRepo: GasStationRepository, private readonly riderRepo: RiderRepository) { }

    async create(data: Partial<IRefillSchedule>) {
        try {
            data.gasStation = "6720bc03ac29369c29eb53ab"
            let payload = await this.repo.create(data);

            this.processSchedule(payload).catch(err => {
                console.error("Error in processSchedule:", err);
            });

            return {
                payload
            }
        }
        catch (err: any) {
            return {
                message: "Schedule not found"
            }
        }
    }

    async getByGcode(gcode: string) {
        try {
            let payload = await this.repo.getByGcode(gcode);
            if (!payload) {
                return {
                    message: "Schedule not found"
                }
            }
            return {
                payload
            }
        }
        catch (err: any) {
            return {
                message: "Schedule not found"
            }
        }
    }

    async getByUser(user: string | Types.ObjectId) {
        let payload = await this.repo.getRefillScheduleByUser(user)
        return { payload }
    }

    async updateScheduleStatus(_id: any, status: RefillStatus) {
        try {
            let payload = await this.repo.update(_id, { status })
            return { payload };
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    async getRefillScheduleByStatus(status: string, user: string | void) {
        try {
            let payload = await this.repo.getRefillScheduleByStatus(status, user)
            return { payload };
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    async processSchedule(data: Partial<IRefillSchedule>) {
        try {
            console.log("Assigning Schedule")
            let schedule = await this.repo.findOne({ _id: data._id });
            //dont forget to filter by the time 
            if (!schedule) {
                console.log("message")
                return { message: "schedule not found" }
                
            }

            //fetch all drivers
            let drivers = await this.riderRepo.find({ gasStation: schedule?.gasStation })
            console.log(drivers)
            let status: boolean = false;

            for (let i = 0; i <= drivers.length; i++) {
                let driver = drivers[i]
                const createdTime = new Date(String(data.pickedUpTime));
                const day = createdTime.getDate();
                const month = createdTime.getMonth() + 1; // Months are zero-indexed in JavaScript
                const year = createdTime.getFullYear();

                let schedulesForDriver = await RefillSchedule.aggregate([
                    {
                        $match: {
                            rider: drivers[i],  // Assuming drivers[i] is an ObjectId
                            $expr: {
                                $and: [
                                    { $eq: [{ $dayOfMonth: "$createdAt" }, day] },
                                    { $eq: [{ $month: "$createdAt" }, month] },
                                    { $eq: [{ $year: "$createdAt" }, year] },
                                ]
                            }
                        }
                    },
                    {
                        $match: { pickedUpTime: data["pickedUpTime"] }  // Match the pickedUpTime if needed
                    }
                ]);

                console.log(schedulesForDriver)

                if (schedulesForDriver.length < 20) {
                    schedule.rider = driver._id as string
                    schedule.status = RefillStatus.MATCHED;
                    console.log("MATCHED")
                    await this.repo.update({ _id: schedule._id }, schedule)
                    status = true
                    break;
                }

                continue
            }

            // send a notification out
            if(!status){
                console.log("No Available Driver")
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }

    async getOrdersByRider(rider: string){
        return {
            payload : await this.repo.find({rider})
        }
    }

    async getOrdersByGasStation(gasStation: string){
        return {
            payload : await this.repo.find({gasStation})
        }
    }

    async updateStatusByStation(editor: Editor, gcode: string, status: RefillStatus){
        try{
            const {gasStation, user, rider} = editor
            let schedule = await this.repo.findOne({gcode});
            if(!schedule){
                return {
                    message: "Schedule Not Found"
                }
            }

            if(gasStation && (String(schedule.gasStation) != String(gasStation))){
                return {
                    message: "You cannot edit this status"
                }
            }

            if(user && (String(schedule.user) != String(user))){
                return {
                    message: "You cannot edit this status"
                }
            }

            if(rider && (String(schedule.rider) != String(rider))){
                return {
                    message: "You cannot edit this status"
                }
            }

            if(!user || !gasStation || !rider){
                return {
                    message: "You cannot edit this status"
                }
            }

            schedule.status = status;
            schedule = await this.repo.update({gcode}, schedule);
            return {
                payload: schedule, 
                message: "Status Updated"
            }
        }
        catch(err: any){
            throw new Error(err)
        }
    }

}

export default RSServices